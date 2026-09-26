/**
 * Reference generator for Receipts, Deliveries, Transfers, and Adjustments
 * Examples: REC/2026/0004, DEL/2026/0003, INT/2026/0003, ADJ/2026/0002
 */
function generateReference(prefix, count) {
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}/${year}/${sequence}`;
}

module.exports = generateReference;
