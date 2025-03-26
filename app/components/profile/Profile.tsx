import React from "react";
import api from './../../lib/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface ProfileProps {
  show: boolean;
  handleClose: () => void;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ show, handleClose, user }) => {
  const [changePassword, setChangePassword] = React.useState<boolean>(false);
  const [oldPassword, setOldPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [showOldPassword, setShowOldPassword] = React.useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    } else if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    api
        .put("/api/change-password", {
            userId: user.id,
            oldPassword,
            newPassword,
            confirmPassword,
        })
        .then((response) => {
          
          
            if (response.status === 200) {
                
                setError("");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setSuccess("Mot de passe changé avec succès.");
                setTimeout(() => {
                    setSuccess("");
                    setChangePassword(false);
                }
                , 3000);
            } else {
                setError(response.data.error || "Une erreur s'est produite.");    
            }
        })
        .catch((error) => {
            setError(error.response?.data?.error || "Une erreur s'est produite.");                      
        });
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleClose}
          ></div>
          <div className="bg-orange-600 rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Profil</h2>
              <button
                className="text-white hover:text-gray-300"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>
            <div className="p-4 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {user.username}
                </h2>
                <p className="mt-2 text-black">Email: {user.email}</p>
                {!changePassword ? (
                  <button
                    className="mt-4 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-300"
                    onClick={() => setChangePassword(true)}
                  >
                    Changer le mot de passe
                  </button>
                ) : (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md shadow-inner space-y-2">
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Ancien mot de passe"
                        className="w-full border border-gray-300 rounded-md text-text-light p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <FaEyeSlash className="text-blue-400" /> : <FaEye className="text-blue-400" />}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nouveau mot de passe"
                        className="w-full border border-gray-300 rounded-md text-text-light p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash className="text-blue-400" /> : <FaEye className="text-blue-400" />}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        className="w-full border border-gray-300 rounded-md text-text-light p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash className="text-blue-400" /> : <FaEye className="text-blue-400" />}
                      </span>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                   
                    <button
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                      onClick={handlePasswordChange}
                    >
                      Changer le mot de passe
                    </button>
                    <button
                      className="w-full bg-gray-100 text-text-light py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-300"
                      onClick={() => {
                        setChangePassword(false);
                        setError("");
                      }}
                    >
                      Annuler
                    </button>
                    {success && <p className="text-green-500">{success}</p>}
                  </div>
                  
                )}
              </div>
            </div>
            <div className="px-4 py-2 border-t border-gray-200 flex justify-end bg-white">
              <button
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                onClick={handleClose}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
