const connection = require('../database/connection');

module.exports = {

    async create(request, response){
        const {title, description, value} = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        //const id =  result[0];
        return response.json({id});
    },

    async index(request, response){   
        
        const { page = 1 } = request.query;
              //count está entre [] para retornar um unico valor e não um array
        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
                                .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
                                .limit(5)
                                .offset((page - 1) * 5)
                                .select([
                                    'incidents.*',
                                    'ongs.nome',
                                    'ongs.whatsapp',
                                    'ongs.email',
                                    'ongs.city',
                                    'ongs.uf'
                                ]);
        
        //retorna no cabeçalho a quantidade de registros
        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);

    },

    async delete(request, response){  
        const {id} = request.params;   
        const ong_id = request.headers.authorization; 

        const incidents = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

            if(incidents.ong_id != ong_id){
                return response.status(401).json({error: 'operation not permitted.'});
            }
            await connection('incidents').where('id', id).delete();
            
            return response.status(204).send();
    }

};