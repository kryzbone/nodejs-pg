'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn('profiles', 'dob', {
        type: Sequelize.DATEONLY,
        allowNull: true
      }, {transaction})
      await queryInterface.addColumn("profiles", "country", {
        type: Sequelize.STRING,
      }, {transaction})

      await transaction.commit()
    }catch(err) {
      await transaction.rollback()
      throw err
    }
   
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('profiles', 'dob')
      await queryInterface.removeColumn("profiles", "country")
      await transaction.commit()
    }catch (err) {
      await transaction.rollback()
      throw err
    }   
  }
};
