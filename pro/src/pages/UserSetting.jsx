import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, updatePassword } from "firebase/auth";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { TextField, Button, Container, Typography, Box, Alert, Link as MUILink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Layout from "../components/Layout";

const UserSetting = () => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Firestoreからユーザー名を取得
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUsername(userDocSnap.data().userName || "");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUsernameChange = (e) => {
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

      // FirestoreのuserNameフィールドを更新
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { userName: username });

      // ユーザーオブジェクトの displayName を更新
      setUser({ ...user, displayName: username });

      setMessage("ユーザーネームの更新成功!");
    } catch (error) {
      setMessage("ユーザーネームの更新に失敗しました。");
      console.error("エラー:", error);
    }
  };

  const handlePasswordReset = async () => {
    if (!user) {
      setPasswordMessage("No authenticated user.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("パスワードが一致しません。");
      return;
    }

    try {
      // Firebase Authenticationのパスワードを更新
      await updatePassword(user, newPassword);
      setPasswordMessage("パスワードの更新成功!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage("パスワードの更新に失敗しました。");
      console.error("エラー:", error);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            ユーザー設定
          </Typography>
          {/* ユーザーネーム変更 */}
          <TextField
            label="ユーザーネーム"
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

          {/* パスワード変更 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            パスワード変更
          </Typography>
          <TextField
            label="新しいパスワード"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="新しいパスワード（確認）"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={handlePasswordReset}
            fullWidth
            sx={{ mt: 2 }}
          >
            パスワードを更新
          </Button>
          {passwordMessage && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {passwordMessage}
            </Alert>
          )}

          {/* パスワードリセットページへのリンク */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2">
              パスワードをリセットしたい場合は、{" "}
              <MUILink component={RouterLink} to="/password-reset">
                こちら
              </MUILink>{" "}
              からリセットしてください。
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default UserSetting;
