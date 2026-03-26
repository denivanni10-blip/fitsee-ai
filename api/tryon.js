module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : (req.body || {});

    const { personImage, garmentImage } = body;

    if (!personImage || !garmentImage) {
      return res.status(400).json({
        error: "Imagens obrigatórias",
        details: "personImage ou garmentImage não foram enviados"
      });
    }

    const createPrediction = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
        input: {
          person_image: personImage,
          garment_image: garmentImage
        }
      })
    });

    const prediction = await createPrediction.json();

    if (!createPrediction.ok) {
      return res.status(500).json({
        error: "Erro na chamada da Replicate",
        details: prediction.detail || prediction.error || JSON.stringify(prediction)
      });
    }

    if (!prediction.urls || !prediction.urls.get) {
      return res.status(500).json({
        error: "Resposta inesperada da Replicate",
        details: prediction.detail || prediction.error || JSON.stringify(prediction)
      });
    }

    const pollUrl = prediction.urls.get;
    let result = prediction;
    let attempts = 0;

    while (
      result.status !== "succeeded" &&
      result.status !== "failed" &&
      attempts < 15
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;

      const pollResponse = await fetch(pollUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });

      result = await pollResponse.json();
    }

    if (result.status === "succeeded") {
      return res.status(200).json({
        output: Array.isArray(result.output) ? result.output[0] : result.output
      });
    }

    if (result.status === "failed") {
      return res.status(500).json({
        error: "Falha na geração da imagem",
        details: result.error || JSON.stringify(result)
      });
    }

    return res.status(500).json({
      error: "Tempo de espera excedido",
      details: JSON.stringify(result)
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno",
      details: error?.message || String(error)
    });
  }
};