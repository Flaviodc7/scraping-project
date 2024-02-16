import mongoose from 'mongoose';

export const connectoToMongoDB = async () => {
  try {
    const mongo_connection_url = process.env.MONGO_CONNECTION_URL ?? '';
    const mongo_db = process.env.MONGO_DB ?? '';

    await mongoose.connect(`${mongo_connection_url}/${mongo_db}`);
    console.log('Conectado a MongoDB.');
  } catch (error) {
    console.log('Error en la conexión a MongoDB.');
    console.log(error);
  }
};
