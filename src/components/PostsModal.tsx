import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function PostsModal({
  selectedMemberId,
  onClose,
}: {
  selectedMemberId: number;
  onClose: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postToEditId, setPostToEditId] = useState<number>();
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${selectedMemberId}/posts`
        );
        if (!response.ok) {
          throw new Error("Fetching todos failed");
        }
        const json = await response.json();
        setPosts(json);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodos();
  }, [selectedMemberId]);

  async function changeTodo(postId: number, value: string) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: value,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Changing post failed");
      }
      const updatedPost = await response.json();
      setPosts((currentPosts) =>
        currentPosts.map((post) => (post.id === postId ? updatedPost : post))
      );
      setPostToEditId(undefined);
      setNewPost("");
    } catch (error) {
      console.error(error);
    }
  }

  return createPortal(
    <div>
      <div className="modal-overlay">
        <ul className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h3 className="text-2xl">Posts</h3>
          {isLoading && (
            <div className="flex items-center justify-center">Loading...</div>
          )}
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center gap-3 pb-1 justify-between"
            >
              {postToEditId !== post.id ? (
                <label>{post.title}</label>
              ) : (
                <input
                  type="text"
                  placeholder="change post"
                  onChange={(e) => setNewPost(e.target.value)}
                  value={newPost}
                  className="border rounded-md p-1"
                ></input>
              )}
              {postToEditId === post.id ? (
                <>
                  <button
                    className="border rounded-md p-1"
                    onClick={() => {
                      changeTodo(post.id, newPost);
                    }}
                  >
                    save
                  </button>
                  <button
                    className="border rounded-md p-1"
                    onClick={() => setPostToEditId(undefined)}
                  >
                    cancel
                  </button>
                </>
              ) : (
                <button
                  className="border rounded-md p-1"
                  onClick={() => {
                    setPostToEditId(post.id);
                  }}
                >
                  change
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.querySelector(".app") as HTMLElement
  );
}
