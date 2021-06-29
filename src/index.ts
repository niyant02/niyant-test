import { PrismaClient } from '@prisma/client';
import express from 'express';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { body, validationResult, CustomValidator } from 'express-validator';
import dotenv from 'dotenv';
import { APP_SECRET, authenticateJWT, getAuthUser } from './helper';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';
import { parseInt } from 'lodash';
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/uploads/images', express.static('uploads/images'));

const isValidUser: CustomValidator = (value) => {
    return prisma.user
        .findFirst({
            where: {
                email: value,
            },
        })
        .then((user) => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        });
};

router.post(
    '/register',
    body('email').custom(isValidUser).isEmail().normalizeEmail(),
    body('name').notEmpty(),
    body('password').isLength({
        min: 8,
    }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
                data: {},
                message: 'Validation',
            });
        }

        const { email, password, name, address = null, mobile = null, avatar = null } = req.body;
        let hashPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                name,
                address,
                mobile,
                avatar,
            },
        });

        if (!user) {
            res.status(500).json({
                success: false,
                errors: [],
                data: {},
                message: 'something went wrong.',
            });
        }

        if (user) {
            const token = sign({ userId: user.id }, APP_SECRET, {
                expiresIn: '1d',
            });

            res.status(200).json({
                data: {
                    token: 'Bearer ' + token,
                    user: user,
                },
                success: true,
                errors: [],
                message: 'Register successfully.',
            });
        }
    },
);

router.post('/profile', upload.single('avatar'), async (req, res) => {
    try {
        let file = 'uploads/images' + '/' + req.file?.originalname;
        if (req.file) {
            fs.rename(req.file?.path, file, (err) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        errors: [err],
                        data: {},
                        message: 'Image upload failed.',
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        errors: [],
                        data: {
                            imagePath: file,
                        },
                        message: 'Image upload successfully.',
                    });
                }
            });
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            errors: [err],
            data: {},
            message: 'Image upload failed.',
        });
    }
});

router.post(
    '/login',
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({
        min: 8,
    }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
                data: {},
                message: 'Validation',
            });
        }

        const { email, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                email,
                isActive: true,
            },
        });

        if (!user) {
            res.status(401).json({ message: 'Email address and password is invalid.' });
        }

        if (user) {
            const passwordValid = await compare(password, user.password);

            if (!passwordValid) {
                res.json({ message: 'Email address and password is invalid.' });
            }

            const token = sign({ userId: user.id }, APP_SECRET, {
                expiresIn: '1d',
            });

            res.status(200).json({
                data: {
                    token: 'Bearer ' + token,
                    user: user,
                },
                success: true,
                errors: [],
                message: 'Login successfully.',
            });
        }
    },
);

router.post(
    '/login/google',
    body('socialId').notEmpty(),
    body('name').notEmpty(),
    body('email').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
                data: {},
                message: 'Validation',
            });
        }

        const { socialId, email, name, profile = null } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                socialId,
                email,
                isActive: true,
            },
        });

        if (user) {
            const token = sign({ userId: user.id }, APP_SECRET, {
                expiresIn: '1d',
            });

            res.status(200).json({
                data: {
                    token: 'Bearer ' + token,
                    user: user,
                },
                success: true,
                errors: [],
                message: 'Login successfully.',
            });
        } else {
            let hashPassword = await hash(socialId, 10);

            const createUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    socialId,
                    socialType: 'google',
                    password: hashPassword,
                    avatar: profile,
                },
            });

            if (!createUser) {
                res.status(500).json({
                    success: false,
                    errors: [],
                    data: {},
                    message: 'something went wrong.',
                });
            }

            if (createUser) {
                const token = sign({ userId: createUser.id }, APP_SECRET, {
                    expiresIn: '1d',
                });

                res.status(200).json({
                    data: {
                        token: 'Bearer ' + token,
                        user: createUser,
                    },
                    success: true,
                    errors: [],
                    message: 'Register successfully.',
                });
            }
        }
    },
);

router.post(
    '/create/property',
    authenticateJWT,
    body('propertyName').notEmpty(),
    body('location').notEmpty(),
    body('latitude').notEmpty(),
    body('longitude').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
                data: {},
                message: 'Validation',
            });
        }

        const { propertyName, location, latitude, longitude } = req.body;

        const userId = getAuthUser(req);

        if (userId) {
            const property = await prisma.property.create({
                data: {
                    propertyName,
                    location,
                    latitude,
                    longitude,
                    createdBy: userId,
                },
            });

            res.status(200).json({
                success: true,
                errors: [],
                data: {
                    property: property,
                },
                message: 'Property create successfully.',
            });
        } else {
            res.status(401).json({
                success: false,
                errors: [],
                data: {},
                message: 'Authorization.',
            });
        }
    },
);

router.post(
    '/update/property/:id',
    body('propertyName').notEmpty().isLength({
        min: 6,
    }),
    body('location').notEmpty(),
    body('latitude').notEmpty(),
    body('longitude').notEmpty(),
    authenticateJWT,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
                data: {},
                message: 'Validation',
            });
        }

        const { propertyName, location, latitude, longitude } = req.body;

        const userId = getAuthUser(req);

        if (userId) {
            const propertyId = req.params?.id;

            if (propertyId) {
                const property = await prisma.property.update({
                    where: {
                        id: parseInt(propertyId),
                    },
                    data: {
                        propertyName,
                        location,
                        latitude,
                        longitude,
                        createdBy: userId,
                    },
                });

                res.status(200).json({
                    success: true,
                    errors: [],
                    data: {
                        property: property,
                    },
                    message: 'Property update successfully.',
                });
            }
        } else {
            res.status(500).json({
                success: false,
                errors: [],
                data: {},
                message: 'something went wrong.',
            });
        }
    },
);

router.post('/delete/property/:id', authenticateJWT, async (req, res) => {
    const propertyId = parseInt(req.params?.id);

    if (propertyId) {
        await prisma.property
            .update({
                where: {
                    id: propertyId,
                },
                data: {
                    deleted: true,
                },
            })
            .then((response: any) => {
                res.status(200).json({
                    success: true,
                    errors: [],
                    data: {
                        property: response,
                    },
                    message: 'Property delete successfully.',
                });
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
});

router.get('/me', authenticateJWT, async (req, res) => {
    const userId = await getAuthUser(req);

    if (userId) {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                isActive: true,
            },
        });

        if (!user) {
            res.status(403).json({
                success: false,
                errors: [],
                data: {},
                message: '403 forbidden',
            });
        }

        if (user) {
            res.status(200).json({
                success: true,
                errors: [],
                data: {
                    user: user,
                },
                message: 'Get user',
            });
        }
    }
});

router.get('/users', authenticateJWT, async (req, res) => {
    const users = await prisma.user.findMany({
        where: {
            isActive: true,
        },
    });

    res.status(200).json({
        success: true,
        errors: [],
        data: {
            users: users,
            totalCount: await prisma.user.count(),
        },
        message: 'Get user list',
    });
});

router.get('/properties', authenticateJWT, async (req, res) => {
    const properties = await prisma.property.findMany({
        where: {
            deleted: false,
        },
    });

    res.status(200).json({
        success: true,
        errors: [],
        data: {
            properties: properties,
            totalCount: await prisma.property.count(),
        },
        message: 'Get property list.',
    });
});

router.get('/property/:id', authenticateJWT, async (req, res) => {
    const propertyId = parseInt(req.params?.id);

    if (propertyId) {
        const property = await prisma.property.findFirst({
            where: {
                id: propertyId,
                deleted: false,
            },
        });

        res.status(200).json({
            success: true,
            errors: [],
            data: {
                property: property,
            },
            message: 'Get property',
        });
    }
});

app.use('/api', router);

const server = app.listen(4000, () => console.log(`🚀 Server ready at: http://localhost:4000`));
