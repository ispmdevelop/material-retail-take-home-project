import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { LoginForm } from "../modules/auth/components/LoginForm";
import { SignUpForm } from "../modules/auth/components/SignUpForm";

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("signup") === "true" ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_e, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Sign in" />
        <Tab label="Sign up" />
      </Tabs>

      {activeTab === 0 ? <LoginForm /> : <SignUpForm />}
    </Box>
  );
}
