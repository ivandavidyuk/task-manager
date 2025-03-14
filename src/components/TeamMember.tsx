export interface MemberProps {
  id: number;
  name: string;
  username: string;
}

export default function TeamMember({ name, username }: MemberProps) {

  return (
    <li className="list-none">
      <b>{name}</b> aka <i>{username}</i>
    </li>
  );
}
