// タスク1件分の見た目だけを持つ部品。
// データ(task)も、押されたときの処理(onToggle/onDelete)も App から props でもらう。
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
      {/* 文字をクリックで完了を切り替え */}
      <span
        className={`flex-1 cursor-pointer ${
          task.done ? "line-through text-gray-400" : ""
        }`}
        onClick={() => onToggle(task.id)}
      >
        {task.text}
      </span>
      {/* 削除ボタン */}
      <button
        className="text-red-400 hover:text-red-600 text-sm"
        onClick={() => onDelete(task.id)}
      >
        削除
      </button>
    </li>
  );
}

export default TaskItem;
