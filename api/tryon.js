<<<<<<< HEAD
export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {

    const { personImage, garmentImage } = req.body;

    const createPrediction = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "ac732df83cea7fff0dea9a3c4c64d1d8d0c8b1e7a49f7e4b06c574ea50649259",
        input: {
          person_image: personImage,
          garment_image: garmentImage
        }
      })
    });

    const prediction = await createPrediction.json();

    let result = prediction;

    while (
      result.status !== "succeeded" &&
      result.status !== "failed"
    ) {

      await new Promise(r => setTimeout(r, 2000));

      const poll = await fetch(result.urls.get, {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });

      result = await poll.json();
    }

    if (result.status === "succeeded") {
      return res.status(200).json({
        output: result.output
      });
    }

    return res.status(500).json({
      error: "Falha na geração da imagem"
    });

  } catch (error) {

    return res.status(500).json({
      error: "Erro interno",
      details: String(error)
    });

  }
=======
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { personImage, garmentImage } = req.body;

    if (!personImage || !garmentImage) {
      return res.status(400).json({ error: 'Imagens não enviadas corretamente' });
    }

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'ac732df83cea7fff0dea9a3c4c64d1d8d0c8b1e7a49f7e4b06c574ea50649259',
        input: {
          person_image: personImage,
          garment_image: garmentImage
        }
      })
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno ao gerar try-on',
      details: String(error)
    });
  }
>>>>>>> 20ff70033fb1c11b353649266bf9f79b1439962f
}