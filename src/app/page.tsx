"use client";
import { useEffect, useState } from "react";
import TeamMember, { MemberProps } from "../components/TeamMember";
import PostModal from "../components/PostsModal";

export default function Home() {
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberProps | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const json = await response.json();
        setMembers(json);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
    setIsLoading(false);
  }, []);

  async function deleteMember(id: number) {
    await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    });
    setMembers((members) => members.filter((member) => member.id !== id));
  }

  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="flex flex-col items-center border-2 max-w-5xl">
          <h1 className="font-semibold text-6xl">My team</h1>
          {isLoading && (
            <div className="flex items-center justify-center text-3xl mt-3">
              Loading...
            </div>
          )}
          {members.map((member) => (
            <ul key={member.id} className="flex items-center gap-3 m-3">
              <TeamMember
                id={member.id}
                name={member.name}
                username={member.username}
              />
              <button
                className="border p-1 rounded-md"
                onClick={() => {
                  setSelectedMember(member);
                }}
              >
                posts
              </button>
              <button
                className="border rounded-md p-1"
                onClick={() => deleteMember(member.id)}
              >
                fire!
              </button>
            </ul>
          ))}
        </div>
      </div>
      {selectedMember && (
        <PostModal
          selectedMemberId={selectedMember.id}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
}
