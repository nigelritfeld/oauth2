const host = (ssl = true) => {
    return `${(ssl ? 'https://' : 'http://')}${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`
}

module.exports = host
