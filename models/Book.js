const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init(
        {
            title: 
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    validate: 
                        {
                            notNull: 
                                {
                                    msg: 'Title is a mandatory field'
                                }
                        }
                },
            author: 
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    validate: 
                        {
                            notNull: 
                                {
                                    msg: 'Author is a mandatory field'
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
                }
        }, { sequelize }
    );
    return Book;
}