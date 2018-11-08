module.exports.define = function(sequelize, DataTypes) {
    return sequelize.define('Location', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coords: {
            type: DataTypes.ARRAY
        }
    });
};
