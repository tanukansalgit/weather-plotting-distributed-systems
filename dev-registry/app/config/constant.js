const basePath = __basePath;

module.exports = {

    path: {
        base                        : basePath,
        app                         : basePath + 'app/',
        module                      : basePath + 'app/module/controller/',
        log                         : basePath + 'asset/log/',
        moduleV1                    : basePath + 'app/module/controller/v1/',
        faviconImg                  : '/favicon.ico'
    },
    maxFileSize: 2 * 1024 * 1024,
    multerFileNameRegex: /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|pdf|PDF|txt|TXT)$/,
    crypto: {
        secretKey: 'vOVH7spmdNWjRRIqCc6rdsx01lwHzrf3',
        algo: 'aes-128-cbc',
        digest: 'hex',
        encoding: 'utf8',
        iv: '\x00\x01\x04\x03\x09\x05\x08\x06\x08\x07\x0a\x0b\x0c\x0d\x0f\x0f'
    },
};
