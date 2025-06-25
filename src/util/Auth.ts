import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DatabaseModel } from '../model/DataBaseModel'

// palavra secreta
const SECRET = 'usuario';
const database = new DatabaseModel().pool;

interface AuthUsuario {
    id: number;
    nomeUsuario: string;
    senha: string;
    exp: number;
}


export class Auth {

    static async validacaoUsuario(req: Request, res: Response): Promise<any> {      
        const { nomeUsuario, senha } = req.body;

        const querySelectUser = `SELECT id_usuario, nome_usuario, senha FROM Usuario WHERE nome_usuario=$1 AND senha=$2;`;
        
        try {
            const queryResult = await database.query(querySelectUser, [nomeUsuario, senha]);

            if (queryResult.rowCount != 0) {
                const usuario = {
                    id_usuario: queryResult.rows[0].id_usuario,
                    nome_usuario: queryResult.rows[0].nome_usuario,
                    senha: queryResult.rows[0].senha
                }

                const tokenUsuario = Auth.generateToken(parseInt(usuario.id_usuario), usuario.nome_usuario, usuario.senha);

                return res.status(200).json({ auth: true, token: tokenUsuario, usuario: usuario });
            } else {
                return res.status(401).json({ auth: false, token: null, message: "Usuário e/ou senha incorretos" });
            }

        } catch (error) {
            console.log(`Erro no modelo: ${error}`);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    static generateToken(id: number, nomeUsuario: string, senha: string) {
        return jwt.sign({ id, nomeUsuario, senha }, SECRET, { expiresIn: '1h' });
    }

    
    static verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            console.log('Token não informado');
            return res.status(401).json({ message: "Token não informado", auth: false }).end();
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expirado');
                    return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
                } else {
                    console.log('Token inválido.');
                    return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
                }
            }

		    // desestrutura o objeto AuthUsuario e armazena as informações exp e id em variáveis 
            const { exp, id } = decoded as AuthUsuario;

            if (!exp || !id) {
                console.log('Data de expiração ou ID não encontrada no token');
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > exp) {
                console.log('Token expirado');
                return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
            }

            req.body.userId = id;

            next();
        });
    }
}