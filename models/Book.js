'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
      title: 
      {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notNull: {
                  msg: 'It looks like you forgot to fill the title field'
              },
              notEmpty: {
                  msg: 'It looks like you forgot to fill the title field'
              }
          }
      },
    author: 
      {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notNull: {
                  msg: 'It looks like you forgot to fill the author field'
              },
              notEmpty: {
                  msg: 'It looks like you forgot to fill the author field'
              }
          }
      },
    genre: 
      {
          type: DataTypes.STRING
      },
    year: 
      {
          type: DataTypes.INTEGER
      }
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'book'
  });
  return Book;
};