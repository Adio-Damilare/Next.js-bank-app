let messagesArray: string[] = [
  "invalid token",
  "jwt expired",
  "jwt malformed",
  "user not found",
  "invalid signature"
];
export default function checkMessage(message: string) {
  return messagesArray.includes(message);
}
