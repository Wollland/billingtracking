function scoreInvoiceForCanonical(invoice) {
  let score = 0;
  if (invoice.extractionConfidence === "high") score += 4;
  if (invoice.extractionConfidence === "medium") score += 2;
  if (invoice.invoiceNumber) score += 2;
  if (invoice.dueDate) score += 1;
  if (invoice.excerpt) score += 1;
  return score;
}

function chooseCanonical(items) {
  return [...items].sort((left, right) => {
    const scoreDelta = scoreInvoiceForCanonical(right) - scoreInvoiceForCanonical(left);
    if (scoreDelta !== 0) return scoreDelta;
    return new Date(left.receivedAt) - new Date(right.receivedAt);
  })[0];
}

function createSuggestedGroups(items, assignedIds) {
  const groups = [];
  const rules = [
    {
      kind: "manual",
      confidence: "high",
      reason: "Coincide la huella manual generada por el parser.",
      key: "manual",
    },
    {
      kind: "invoice_number",
      confidence: "high",
      reason: "Coinciden proveedor, numero de factura e importe total.",
      key: "invoice",
    },
    {
      kind: "attachment",
      confidence: "medium",
      reason: "Coinciden nombre de PDF e importe total.",
      key: "file",
    },
    {
      kind: "fallback",
      confidence: "medium",
      reason: "Coinciden proveedor, fecha de factura e importe total.",
      key: "fallback",
    },
  ];

  rules.forEach((rule) => {
    const buckets = new Map();

    items.forEach((item) => {
      if (assignedIds.has(item.id)) return;

      const fingerprint = item.fingerprints?.[rule.key];
      if (!fingerprint) return;

      const bucket = buckets.get(fingerprint) || [];
      bucket.push(item);
      buckets.set(fingerprint, bucket);
    });

    buckets.forEach((bucketItems, fingerprint) => {
      if (bucketItems.length < 2) return;

      const canonical = chooseCanonical(bucketItems);
      const duplicateImpact =
        bucketItems.reduce((sum, item) => sum + Number(item.amountTotal || 0), 0) -
        Number(canonical.amountTotal || 0);

      groups.push({
        id: `suggested:${rule.kind}:${fingerprint}`,
        source: "suggested",
        kind: rule.kind,
        confidence: rule.confidence,
        reason: rule.reason,
        reviewStatus: "open",
        canonicalId: canonical.id,
        canonical,
        duplicateImpact,
        items: bucketItems,
      });

      bucketItems.forEach((item) => assignedIds.add(item.id));
    });
  });

  return groups;
}

export function buildDuplicateState(records) {
  const persistedGroupsMap = new Map();
  const assignedIds = new Set();

  records.forEach((record) => {
    if (!record.persistedGroup) return;

    const bucket = persistedGroupsMap.get(record.persistedGroup.id) || {
      id: record.persistedGroup.id,
      source: "persisted",
      kind: record.persistedGroup.detectionMethod,
      confidence: record.persistedGroup.confidence,
      reason: record.persistedGroup.reason,
      reviewStatus: record.persistedGroup.reviewStatus,
      canonicalId: record.persistedGroup.canonicalOccurrenceId,
      duplicateImpact: record.persistedGroup.duplicateImpact,
      items: [],
    };

    bucket.items.push(record);
    persistedGroupsMap.set(record.persistedGroup.id, bucket);
    assignedIds.add(record.id);
  });

  const persistedGroups = [...persistedGroupsMap.values()].map((group) => {
    const canonical =
      group.items.find((item) => item.id === group.canonicalId) || chooseCanonical(group.items);

    return {
      ...group,
      canonicalId: canonical.id,
      canonical,
      duplicateImpact:
        group.duplicateImpact ||
        group.items.reduce((sum, item) => sum + Number(item.amountTotal || 0), 0) -
          Number(canonical.amountTotal || 0),
    };
  });

  const suggestedGroups = createSuggestedGroups(records, assignedIds);
  const groups = [...persistedGroups, ...suggestedGroups].sort((left, right) => {
    if (right.duplicateImpact !== left.duplicateImpact) {
      return right.duplicateImpact - left.duplicateImpact;
    }

    return right.items.length - left.items.length;
  });

  const duplicateMetaByInvoiceId = {};

  groups.forEach((group) => {
    group.items.forEach((item) => {
      duplicateMetaByInvoiceId[item.id] = {
        groupId: group.id,
        source: group.source,
        confidence: group.confidence,
        reason: group.reason,
        reviewStatus: group.reviewStatus,
        role: item.id === group.canonicalId ? "canonical" : "duplicate",
        count: group.items.length,
        duplicateImpact: group.duplicateImpact,
      };
    });
  });

  return {
    groups,
    duplicateMetaByInvoiceId,
  };
}
