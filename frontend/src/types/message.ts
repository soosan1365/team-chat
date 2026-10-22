export type Message = {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
  };
  replyTo: {
    id: string;
    content: string;
    user: {
      id: string;
      name: string | null;
    };
  } | null;
  type: string;
  audioUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
};