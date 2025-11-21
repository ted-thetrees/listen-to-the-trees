const BASEROW_TOKEN = 'rn1LuQywePUftp2kvQUxTzuBGHljqzLr';
const BASEROW_API = 'https://api.baserow.io/api';

export async function getTableRows(tableId: number) {
  const response = await fetch(`${BASEROW_API}/database/rows/table/${tableId}/?user_field_names=true`, {
    headers: {
      'Authorization': `Token ${BASEROW_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Baserow API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getTableFields(tableId: number) {
  const response = await fetch(`${BASEROW_API}/database/fields/table/${tableId}/`, {
    headers: {
      'Authorization': `Token ${BASEROW_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Baserow API error: ${response.status}`);
  }
  
  return response.json();
}
