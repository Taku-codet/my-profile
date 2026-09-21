// props（title・author・rating・comment）を受け取って、本1冊分のカードを返す部品
// rating は 1〜5 の「数値」で受け取り、ここで ★ と ☆ を組み立てて表示する
function BookCard({ title, author, rating, comment }) {
  // 数値の分だけ ★ を並べ、残りを ☆ で埋める（例: 4 → ★★★★☆）
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:scale-105 transition">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-500 text-sm">著者: {author}</p>
      <p className="text-yellow-500">{stars}</p>
      <p className="text-gray-600 mt-2">{comment}</p>
    </div>
  );
}

export default BookCard;
