const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init(
        {
            title: 
                {
                    type: Sequelize.STRING,
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
                    type: Sequelize.STRING,
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
                    type: Sequelize.STRING
                },
            year: 
                {
                    type: Sequelize.INTEGER
                }, 
        }, {
            tableName: 'Books',
            sequelize
        }, { sequelize }
    );
    return Book;
}