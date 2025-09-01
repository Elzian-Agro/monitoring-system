export function downloadCSV(data, filename, headers, transformData) {
  // Transform the data using the provided logic
  const transformedData = data.map(transformData);

  // Convert the transformed data to CSV
  const csv = convertArrayOfObjectsToCSV(headers, transformedData);
  if (csv == null) return;

  // Add data prefix if not present
  const csvData = RegExp(/^data:text\/csv/i).exec(csv) ? csv : `data:text/csv;charset=utf-8,${csv}`;

  // Trigger the download
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvData));
  link.setAttribute('download', filename);
  link.click();
}

function convertArrayOfObjectsToCSV(headers, data) {
  const csvRows = [];

  // Add headers as the first row
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => `"${row[header] || ''}"`);
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}
