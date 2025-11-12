import express from "express";
import certificatesController from "../controllers/certificatesController.js";
import { authenticateFirebase } from "../middlewares/authFirebase.js";

const CertificatesRoutes = express.Router();

// Crear un nuevo certificado
CertificatesRoutes.post(
  "/certificates/create",
  authenticateFirebase,
  certificatesController.create
);

// Eliminar un certificado por ID
CertificatesRoutes.delete("/certificates/delete",authenticateFirebase,certificatesController.delete);

export default CertificatesRoutes;
