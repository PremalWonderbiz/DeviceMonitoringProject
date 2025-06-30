export function getChangedPaths(
  obj1: any,
  obj2: any,
  path: string = '',
  labelPath: string = ''
): string[] {
  const changes: string[] = [];

  // === Handle arrays ===
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLength = Math.max(obj1.length, obj2.length);

    for (let i = 0; i < maxLength; i++) {
      const val1 = obj1[i];
      const val2 = obj2[i];

      const structuralPath = `${path}[${i}]`;
      const arrayKey = path.split('.').pop() ?? 'Item';
      const labelPathForItem = `${labelPath}.${arrayKey} ${i}`;

      if (
        typeof val1 === 'object' &&
        typeof val2 === 'object' &&
        val1 !== null &&
        val2 !== null
      ) {
        // Recursively get changed subfields only
        changes.push(...getChangedPaths(val1, val2, structuralPath, labelPathForItem));
      } else if (val1 !== val2) {
        // Primitive value difference in array
        changes.push(labelPathForItem);
      }
    }

    return changes;
  }

  // === Handle objects ===
  if (
    typeof obj1 === 'object' &&
    typeof obj2 === 'object' &&
    obj1 !== null &&
    obj2 !== null
  ) {
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    allKeys.forEach((key) => {
      const nextPath = path ? `${path}.${key}` : key;
      const nextLabelPath = labelPath ? `${labelPath}.${key}` : key;

      const val1 = obj1[key];
      const val2 = obj2[key];

      if (
        typeof val1 === 'object' &&
        typeof val2 === 'object' &&
        val1 !== null &&
        val2 !== null
      ) {
        changes.push(...getChangedPaths(val1, val2, nextPath, nextLabelPath));
      } else if (val1 !== val2) {
        changes.push(nextLabelPath);
      }
    });

    return changes;
  }

  // === Primitive change
  if (obj1 !== obj2 && path) {
    return [labelPath];
  }

  return [];
}
