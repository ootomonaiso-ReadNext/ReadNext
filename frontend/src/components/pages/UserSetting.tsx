import { useState, useEffect, type ChangeEvent } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore操作のための関数をインポート
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { firestore } from "../../constants/firestore";

const UserSetting = () => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Firestoreからユーザー名を取得
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUsername(userDocSnap.data().userName || ""); // Firestoreから取得したuserNameをセット
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSave = async () => {
    if (!user) {
      setMessage("No authenticated user.");
      return;
    }

    try {
      // Firebase AuthenticationのdisplayNameを更新
      await updateProfile(user, { displayName: username });
      setUser({ ...user, displayName: username });

      // FirestoreのuserNameフィールドを更新
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, { userName: username });

      setMessage("ユーザーネームの更新成功!");
    } catch (error) {
      setMessage("なんか更新失敗しちゃった...");
      console.error("えらー!そのユーザーネームのここがおかしい:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          ゆーざーせってぃんぐ
        </Typography>
        <TextField
          label="Username"
          value={username}
          onChange={handleUsernameChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          sx={{ mt: 2 }}
        >
          変更を保存
        </Button>
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default UserSetting;
