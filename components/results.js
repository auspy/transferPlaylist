export default function results(req, res) {
  const type = req.query.type;
  const failed = req.query.failed;
  const playlistId = req.query.playlistId;
  res.render("pages/results", {
    results: JSON.stringify({
      failed,
      playlistId,
      type,
    }),
  });
}
