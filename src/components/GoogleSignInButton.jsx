import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function GoogleSignInButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="outlined"
      sx={{
        backgroundColor: 'white',
        color: 'trasparent',
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        '&:hover': {
          backgroundColor: '#f7f7f7',
        },
      }}
      startIcon={<GoogleIcon />}
    >
      Accedi con Google
    </Button>
  );
}
