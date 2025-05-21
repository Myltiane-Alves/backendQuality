// import fs from 'fs';
// import https from 'https';

// // Ler os arquivos extraídos anteriormente
// const privateKey = fs.readFileSync('key.key', 'utf8');
// const certificate = fs.readFileSync('certificate.crt', 'utf8');

// const options = { key: privateKey, cert: certificate };

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Servidor HTTPS funcionando!');
// });

// https.createServer(options, app).listen(443, () => {
//   console.log('Servidor HTTPS rodando na porta 443');
// });


// Extrair o certificado
// openssl pkcs12 -in "GTO 2024-2025.pfx" -clcerts -nokeys -out certificate.pem -passin pass:"#senhagto2024#"


// Extrair a cadeia de certificados (caso necessário)
// openssl pkcs12 -in "GTO 2024-2025.pfx" -cacerts -nokeys -out ca-cert.pem -passin pass:"#senhagto2024#"


// import forge from 'node-forge';

// export class CertificationChain {
//     constructor(chainkeysstring = null) {
//         this.rawKey = '';
//         this.chainKeys = [];

//         if (chainkeysstring) {
//             this.rawKey = chainkeysstring;
//             this.loadListChain();
//         }
//     }

//     add(content) {
//         if (this.isBinary(content)) {
//             content = Buffer.from(content, 'binary').toString('base64');
//             content = content.match(/.{1,64}/g).join('\n');
//             content = `-----BEGIN CERTIFICATE-----\n${content}\n-----END CERTIFICATE-----\n`;
//         }
//         return this.loadList(content);
//     }

//     isBinary(str) {
//         return /[^\x20-\x7E\t\r\n]/.test(str);
//     }

//     removeExpiredCertificates() {
//         this.chainKeys = this.chainKeys.filter(publicKey => !this.isExpired(publicKey));
//     }

//     isExpired(publicKey) {
//         const now = new Date();
//         return publicKey.validity.notAfter < now;
//     }

//     listChain() {
//         return this.chainKeys;
//     }

//     toString() {
//         this.rawString();
//         return this.rawKey;
//     }

//     getExtraCertsForPFX() {
//         return this.chainKeys.length ? { extracerts: this.chainKeys.map(cert => cert.pem) } : {};
//     }

//     loadListChain() {
//         const arr = this.rawKey.split("-----END CERTIFICATE-----");
//         arr.forEach(a => {
//             if (a.trim().length > 20) {
//                 const cert = `${a}-----END CERTIFICATE-----\n`;
//                 this.loadList(cert);
//             }
//         });
//     }

//     loadList(certificate) {
//         const publicKey = forge.pki.certificateFromPem(certificate);
//         this.chainKeys.push(publicKey);
//         return this.chainKeys;
//     }

//     rawString() {
//         this.rawKey = this.chainKeys.map(cert => forge.pki.certificateToPem(cert)).join('');
//     }
// }


import forge from 'node-forge';

export class CertificationChain {
  constructor(chainkeysstring = null) {
    this.rawKey = '';
    this.chainKeys = [];

    if (chainkeysstring) {
      this.rawKey = chainkeysstring;
      this.loadListChain();
    }
  }

  add(content) {
    if (this.isBinary(content)) {
      content = Buffer.from(content, 'binary').toString('base64');
      content = content.match(/.{1,64}/g).join('\n');
      content = `-----BEGIN CERTIFICATE-----\n${content}\n-----END CERTIFICATE-----\n`;
    }
    return this.loadList(content);
  }

  isBinary(str) {
    return /[^\x20-\x7E\t\r\n]/.test(str);
  }

  removeExpiredCertificates() {
    this.chainKeys = this.chainKeys.filter(publicKey => !this.isExpired(publicKey));
  }

  isExpired(publicKey) {
    const now = new Date();
    return publicKey.validity.notAfter < now;
  }

  listChain() {
    return this.chainKeys;
  }

  toString() {
    this.rawString();
    return this.rawKey;
  }

  getExtraCertsForPFX() {
    return this.chainKeys.length ? { extracerts: this.chainKeys.map(cert => cert.pem) } : {};
  }

  loadListChain() {
    const arr = this.rawKey.split("-----END CERTIFICATE-----");
    arr.forEach(a => {
      if (a.trim().length > 20) {
        const cert = `${a}-----END CERTIFICATE-----\n`;
        this.loadList(cert);
      }
    });
  }

  loadList(certificate) {
    const publicKey = forge.pki.certificateFromPem(certificate);
    this.chainKeys.push(publicKey);
    return this.chainKeys;
  }

  rawString() {
    this.rawKey = this.chainKeys.map(cert => forge.pki.certificateToPem(cert)).join('');
  }

  // Novo método para codificar os certificados em Base64
  encodeBase64() {
    return this.chainKeys.map(cert => {
      const pem = forge.pki.certificateToPem(cert);
      const der = forge.pki.pemToDer(pem); // Converte o PEM para DER
      return forge.util.encode64(der.getBytes()); // Codifica o DER em Base64
    });
  }
}

// Exemplo de uso
const chain = new CertificationChain();
chain.add(`-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJALa6g5Zk1+1OMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkJFMRUwEwYDVQQIDAxTb21lLVN0YXRlMRYwFAYDVQQKDA1FeGFtcGxlIENv
bXBhbnkwHhcNMjAwMTAxMDAwMDAwWhcNMjUwMTAxMDAwMDAwWjBFMQswCQYDVQQG
EwJCRTEVMBMGA1UECAwMU29tZS1TdGF0ZTEWMBQGA1UECgwNRXhhbXBsZSBDb21w
YW55MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7Vq3z5F7z6+9F9kJ
...
-----END CERTIFICATE-----`);

console.log(chain.encodeBase64());










// import fs from 'fs';
// import forge from 'node-forge';

// // Função para ler um arquivo PFX e obter o certificado
// async function readPfx(filePath, password) {
//   // Ler o conteúdo do arquivo PFX
//   const pfxData = fs.readFileSync(filePath, 'binary');

//   // Converter os dados do PFX para um formato utilizável
//   const p12Asn1 = forge.asn1.fromDer(pfxData);
//   const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

//   // Extrair a chave privada e o certificado
//   const bags = p12.getBags({ bagType: forge.pki.oids.keyBag });
//   const privateKey = bags[forge.pki.oids.keyBag][0].key;

//   const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
//   const certificate = certBags[forge.pki.oids.certBag][0].cert;

//   return { privateKey, certificate };
// }

// // Função para verificar se o certificado está expirado
// function isExpired(certificate) {
//   const now = new Date();
//   return now > certificate.validity.notAfter;
// }

// // Função para assinar dados com a chave privada
// function signData(privateKey, data, algorithm = 'sha1') {
//   const md = forge.md[algorithm].create();
//   md.update(data, 'utf8');
//   const signature = privateKey.sign(md);
//   return forge.util.encode64(signature);
// }

// // Função para verificar a assinatura usando a chave pública
// function verifySignature(certificate, data, signature, algorithm = 'sha1') {
//   const md = forge.md[algorithm].create();
//   md.update(data, 'utf8');
//   const decodedSignature = forge.util.decode64(signature);
//   return certificate.publicKey.verify(md.digest().bytes(), decodedSignature);
// }

// // Função para obter a Razão Social gravada no certificado
// function getCompanyName(certificate) {
//   return certificate.subject.getField('CN').value;
// }

// // Função para obter a data de validade do certificado
// function getValidFrom(certificate) {
//   return certificate.validity.notBefore;
// }

// function getValidTo(certificate) {
//   return certificate.validity.notAfter;
// }

// (async () => {
//   try {
//     const { privateKey, certificate } = await readPfx('GTO 2024-2025.pfx', '#senhagto2024#');

//     // Exibir informações do certificado
//     console.log(forge.pki.certificateToPem(certificate));

//     // Verificar se o certificado está expirado
//     if (isExpired(certificate)) {
//       console.log("Certificado VENCIDO! Não é possível mais usá-lo");
//     } else {
//       console.log("Certificado VÁLIDO!");
//     }

//     // Obter a Razão Social gravada no certificado
//     const companyName = getCompanyName(certificate);
//     console.log("Razão Social:", companyName);

//     // Obter a data de validade do certificado
//     const validFrom = getValidFrom(certificate);
//     const validTo = getValidTo(certificate);
//     console.log("Validade de:", validFrom.toISOString());
//     console.log("Validade até:", validTo.toISOString());

//     // Assinar e verificar dados
//     const dataToSign = "dados a serem assinados";
//     const signature = signData(privateKey, dataToSign);
//     console.log("Assinatura:", signature);

//     if (verifySignature(certificate, dataToSign, signature)) {
//       console.log("Assinatura Confere !!!");
//     } else {
//       console.log("ERRO. A assinatura NÃO confere");
//     }
//   } catch (error) {
//     console.error("Erro ao processar o certificado:", error);
//   }
// })();