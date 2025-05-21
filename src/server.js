import app from './app.js';
const PORT = process.env.PORT || 6001;
// const PORT =  'http://164.152.244.96:6001';
// const PORT =  'https://confidencial-api.vercel.app';

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta `, PORT);
});


// import fs from 'fs';
// import https from 'https';
// import forge from 'node-forge';
// import express from 'express';

// // Caminho para o certificado PFX e senha
// const pfxPath = 'GTO 2024-2025.pfx';
// const pfxPassword = '#senhagto2024#';

// const pfxBuffer = fs.readFileSync(pfxPath);

// // Converter o PFX para chave e certificado
// const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'), false);
// const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, pfxPassword);

// // Extrair chave privada e certificado
// let privateKeyPem = null;
// let certificatePem = null;

// p12.safeContents.forEach(safeContent => {
//   safeContent.safeBags.forEach(bag => {
//     if (bag.type === forge.pki.oids.certBag && bag.cert) {
//       certificatePem = forge.pki.certificateToPem(bag.cert);
//     }
//     if (bag.type === forge.pki.oids.pkcs8ShroudedKeyBag && bag.key) {
//       privateKeyPem = forge.pki.privateKeyToPem(bag.key);
//     }
//   });
// });

// // Verificar se os valores foram extraídos corretamente
// if (!privateKeyPem || !certificatePem) {
//   console.error('Erro ao extrair chave privada ou certificado.');
//   process.exit(1);
// }

// // Escrever os arquivos extraídos (opcional para depuração)
// fs.writeFileSync('privateKey.pem', privateKeyPem);
// fs.writeFileSync('certificate.pem', certificatePem);

// // Configuração do servidor HTTPS
// const options = {
//   key: fs.readFileSync('privateKey.pem'),
//   cert: fs.readFileSync('certificate.pem')
// };



// https.createServer(options, app).listen(443, () => {
//   console.log('Servidor HTTPS rodando na porta 443');
// });


// import { readFileSync } from 'fs';
// import forge from 'node-forge';

// class PublicKey {
//     constructor(certificate) {
//         try {
//             this.certificate = forge.pki.certificateFromPem(certificate);
//             this.commonName = this.certificate.subject.getField('CN').value;
//         } catch (error) {
//             throw new Error(`Cannot read X.509 certificate. ${error.message}`);
//         }
//     }

//     isExpired() {
//         const now = new Date();
//         return now > this.certificate.validity.notAfter;
//     }

//     toString() {
//         return forge.pki.certificateToPem(this.certificate);
//     }
// }

// class CertificationChain {
//     constructor(chainKeysString = null) {
//         this.rawKey = '';
//         this.chainKeys = [];

//         if (chainKeysString) {
//             this.rawKey = chainKeysString;
//             this.loadListChain();
//         }
//     }

//     addPemCertificate(content) {
//         const publicKey = new PublicKey(content);
//         this.chainKeys.push(publicKey);
//         return this.chainKeys;
//     }

//     addPfxCertificate(pfxBuffer, password) {
//         try {
//             const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
//             const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

//             p12.safeContents.forEach(safeContent => {
//                 safeContent.safeBags.forEach(bag => {
//                     if (bag.type === forge.pki.oids.certBag) {
//                         const pem = forge.pki.certificateToPem(bag.cert);
//                         this.addPemCertificate(pem);
//                     }
//                 });
//             });

//         } catch (error) {
//             throw new Error(`Failed to load PFX file: ${error.message}`);
//         }
//     }

//     removeExpiredCertificates() {
//         this.chainKeys = this.chainKeys.filter(publicKey => !publicKey.isExpired());
//     }

//     listChain() {
//         return this.chainKeys;
//     }

//     toString() {
//         return this.chainKeys.map(cert => cert.toString()).join('\n');
//     }
// }

// // Exemplo de uso
// const chain = new CertificationChain();
// const pfxPassword = '#senhagto2024#';
// const pfxFileName = 'GTO 2024-2025.pfx';
// const pfxFileContent = readFileSync(pfxFileName);

// chain.addPfxCertificate(pfxFileContent, pfxPassword);
// console.log(chain.toString());

// import { readFileSync } from 'fs';
// import forge from 'node-forge';

// class PublicKey {
//     constructor(certificate) {
//         try {
//             this.certificate = forge.pki.certificateFromPem(certificate);
//             this.commonName = this.certificate.subject.getField('CN').value;
//         } catch (error) {
//             throw new Error(`Cannot read X.509 certificate. ${error.message}`);
//         }
//     }

//     isExpired() {
//         const now = new Date();
//         return now > this.certificate.validity.notAfter;
//     }

//     toString() {
//         return forge.pki.certificateToPem(this.certificate)
//             .replace(/-----BEGIN CERTIFICATE-----\n?/g, '')
//             .replace(/\n?-----END CERTIFICATE-----/g, '')
//             .trim(); // Remove espaços extras
//     }
    
// }

// class CertificationChain {
//     constructor(chainKeysString = null) {
//         this.rawKey = '';
//         this.chainKeys = [];

//         if (chainKeysString) {
//             this.rawKey = chainKeysString;
//             this.loadListChain();
//         }
//     }

//     addPemCertificate(content) {
//         const publicKey = new PublicKey(content);
//         this.chainKeys.push(publicKey);
//         return this.chainKeys;
//     }

//     addPfxCertificate(pfxBuffer, password) {
//         try {
//             const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
//             const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

//             p12.safeContents.forEach(safeContent => {
//                 safeContent.safeBags.forEach(bag => {
//                     if (bag.type === forge.pki.oids.certBag) {
//                         const pem = forge.pki.certificateToPem(bag.cert);
//                         this.addPemCertificate(pem);
//                     }
//                 });
//             });

//         } catch (error) {
//             throw new Error(`Failed to load PFX file: ${error.message}`);
//         }
//     }

//     removeExpiredCertificates() {
//         this.chainKeys = this.chainKeys.filter(publicKey => !publicKey.isExpired());
//     }

//     listChain() {
//         return this.chainKeys;
//     }

//     toString() {
//         return this.chainKeys.map(cert => cert.toString()).join('\n\n');
//     }
// }

// // Exemplo de uso
// const chain = new CertificationChain();
// const pfxPassword = '#senhagto2024#';
// const pfxFileName = 'GTO 2024-2025.pfx';
// const pfxFileContent = readFileSync(pfxFileName);

// chain.addPfxCertificate(pfxFileContent, pfxPassword);
// console.log(chain.toString());

// import fs from 'fs';
// import forge from 'node-forge';

// const pfxPath = 'GTO 2024-2025.pfx';
// const password = '#senhagto2024#';

// // Ler o arquivo PFX
// const pfxBuffer = fs.readFileSync(pfxPath);

// // Converter PFX para um objeto forge
// const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'), true);
// const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

// // Extrair a chave privada e o certificado
// let privateKey = null;
// let certificate = null;

// for (const safeContents of p12.safeContents) {
//     for (const safeBag of safeContents.safeBags) {
//         if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
//             privateKey = forge.pki.privateKeyToPem(safeBag.key);
//         } else if (safeBag.type === forge.pki.oids.certBag) {
//             certificate = forge.pki.certificateToPem(safeBag.cert);
//         }
//     }
// }

// if (privateKey && certificate) {
//     console.log("Private Key Length:", privateKey.length);
//     console.log("Certificate Length:", certificate.length);

//     // Concatenar a chave privada e o certificado
//     const certFileContent = privateKey + '\n' + certificate;

//     // Escrever o conteúdo concatenado em um arquivo
//     const outputPath = 'certificado_completo.pem';
//     fs.writeFileSync(outputPath, certFileContent);
//     console.log(`Certificado completo salvo em: ${outputPath}`);
// } else {
//     console.log("Falha ao ler o arquivo PFX.");
// }