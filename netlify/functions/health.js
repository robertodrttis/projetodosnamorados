/** Endpoint simples — confirma que o backend está no ar. */
exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      message: 'Feliz Dia dos Namorados',
      timestamp: new Date().toISOString(),
    }),
  }
}
