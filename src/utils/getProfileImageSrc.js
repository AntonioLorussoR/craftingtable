export default function getProfileImageSrc(user) {
  if (!user?.profilePicture?.data) return "https://placehold.co/100x100";

  const binary = new Uint8Array(user.profilePicture.data.data);
  const base64String = btoa(binary.reduce((data, byte) => data + String.fromCharCode(byte), ""));
  return `data:${user.profilePicture.contentType};base64,${base64String}`;
}
