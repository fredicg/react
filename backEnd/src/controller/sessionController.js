const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const { id } = request.body;

        const ong = await connection('ongs')
                            .where('id', id)
                            .select('nome')
                            .first();
        
        if(!ong){
            return response.status(400).json({erro: 'No ONG find with this id.'});
        }

        return response.json(ong);
        
        


    }
}