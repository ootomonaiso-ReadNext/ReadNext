// src/pages/UserMake.js
import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../constants/firestore";

const UserMake = () => {
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string | null>(null); 
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleServiceAccountCreation = async () => {
    // ユーザーIDとユーザーネームが空でないかを確認
    if (!userId.trim() || !userName.trim()) {
      setError("ユーザーIDとユーザーネーム書いてないよ"); 
      return;
    }

    try {
      if (!user?.uid) throw new Error("uidが存在しません")
      const settings = { theme: "light", notifications: true };
      await setDoc(doc(firestore, "users", user.uid || ""), {
        userId,
        userName,
        settings,
        createdAt: new Date()
      })
      alert("サービスアカウントが作成されました！")
      navigate("/");
    } catch (error) {
      console.error("Service Account Creation Error:", error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          サービスアカウント作成
        </Typography>
        {error && <Typography color="error">{error}</Typography>} {/* エラーメッセージの表示 */}
        <TextField
          label="User ID (Unique)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <TextField
          label="User Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleServiceAccountCreation}
        >
          作成する
        </Button>
      </Box>
    </Container>
  );
};

export default UserMake;
