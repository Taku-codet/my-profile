import Header from './components/Header';
import Footer from './components/Footer';
import BookCard from './components/BookCard';

// ① 本のデータを配列にまとめる（id は key 専用の整理番号）
// rating は 1〜5 の「数値」で持つ。★の表示は BookCard 側で組み立てる
const books = [
  {
    id: 1,
    title: "JavaScript入門",
    author: "田中 太郎",
    rating: 4,
    comment: "基礎からていねいで、最初の1冊によかった。",
  },
  {
    id: 2,
    title: "Reactの教科書",
    author: "山田 花子",
    rating: 5,
    comment: "コンポーネント設計の考え方が勉強になった。",
  },
  {
    id: 3,
    title: "CSS設計完全ガイド",
    author: "鈴木 一郎",
    rating: 3,
    comment: "分厚いが、辞書として手元に置きたい。",
  },
    {
    id: 4,
    title: "React概要",
    author: "山根 拓己",
    rating: 4,
    comment: "Reactが体系的に学べる。",
  },
];

function App() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* ③ ページを部品の組み合わせで構成する */}
      <Header />

      <main className="space-y-4">
        {/* ② map で配列を回し、1件ごとに BookCard を1枚作る */}
        {books.map((book) => (
          <BookCard
            key={book.id}          // ← React 専用の目印（BookCard には渡らない）
            title={book.title}
            author={book.author}
            rating={book.rating}
            comment={book.comment}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}

export default App;
