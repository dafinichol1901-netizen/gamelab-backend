
require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const DB_NAME = "db_gamelab_indonesia";
const KELAS_COLLECTION = "daftar_kelas_pemrograman";
const SISWA_COLLECTION = "pendaftaran_siswa";

// Membuka koneksi dan menjalankan operasi database.
async function withDatabase(callback) {
    if (!uri) {
        throw new Error("MONGODB_URI belum diatur di file .env");
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const db = client.db(DB_NAME);
        return await callback(db);
    } finally {
        await client.close();
    }
}

// 1. Membuat collection pendaftaran_siswa.
async function create_db() {
    await withDatabase(async (db) => {
        const collections = await db
            .listCollections({ name: SISWA_COLLECTION })
            .toArray();

        if (collections.length > 0) {
            console.log(
                `Collection '${SISWA_COLLECTION}' sudah tersedia!`
            );
            return;
        }

        await db.createCollection(SISWA_COLLECTION);

        console.log(
            `Database ${DB_NAME} dan collection ${SISWA_COLLECTION} berhasil dibuat!`
        );
    });
}

// 2. Memasukkan data pendaftaran siswa.
async function insert_pendaftaran() {
    await withDatabase(async (db) => {
        const collection = db.collection(SISWA_COLLECTION);

        const dataSiswa = [
            {
                _id: 101,
                nama_siswa: "Ainun",
                kelas_id: 1,
                status: "Aktif"
            },
            {
                _id: 102,
                nama_siswa: "Rathil",
                kelas_id: 2,
                status: "Pending"
            }
        ];

        // Menghindari duplikasi jika fungsi dijalankan kembali.
        const operations = dataSiswa.map((siswa) => ({
            updateOne: {
                filter: { _id: siswa._id },
                update: { $setOnInsert: siswa },
                upsert: true
            }
        }));

        const result = await collection.bulkWrite(operations);

        console.log(
            `${result.upsertedCount} data pendaftaran baru ditambahkan.`
        );
        console.log(
            `${result.matchedCount} data sudah tersedia sebelumnya.`
        );
    });
}

// 3. Memperbarui deskripsi kelas HTML (_id: 1).
async function update_html() {
    await withDatabase(async (db) => {
        const collection = db.collection(KELAS_COLLECTION);

        const result = await collection.updateOne(
            { _id: 1 },
            {
                $set: {
                    deskripsi: "Belajar Dasar HTML5 dan Struktur Web"
                }
            }
        );

        if (result.matchedCount === 0) {
            console.log("Data kelas HTML dengan _id: 1 tidak ditemukan.");
            return;
        }

        if (result.modifiedCount === 0) {
            console.log("Deskripsi kelas HTML sudah sesuai.");
            return;
        }

        console.log("Deskripsi kelas HTML berhasil diperbarui!");
    });
}

// 4. Menampilkan siswa dengan status Aktif saja.
async function read_aktif() {
    await withDatabase(async (db) => {
        const collection = db.collection(SISWA_COLLECTION);

        const dataSiswa = await collection
            .find({ status: "Aktif" })
            .sort({ _id: 1 })
            .toArray();

        console.log("=== DAFTAR SISWA AKTIF ===");

        if (dataSiswa.length === 0) {
            console.log("Tidak ada siswa dengan status Aktif.");
            return;
        }

        dataSiswa.forEach((siswa) => {
            console.log(`ID          : ${siswa._id}`);
            console.log(`Nama Siswa  : ${siswa.nama_siswa}`);
            console.log(`Kelas ID    : ${siswa.kelas_id}`);
            console.log(`Status      : ${siswa.status}`);
            console.log("--------------------------");
        });
    });
}

// Perintah yang bisa dijalankan melalui terminal.
const daftar_fungsi = {
    create_db,
    insert_pendaftaran,
    update_html,
    read_aktif
};

if (require.main === module) {
    const perintah = process.argv[2];

    if (!daftar_fungsi[perintah]) {
        console.log("Perintah tidak dikenal.");
        console.log("Pilihan perintah:");

        Object.keys(daftar_fungsi).forEach((nama) => {
            console.log(`- ${nama}`);
        });

        process.exitCode = 1;
    } else {
        daftar_fungsi[perintah]().catch((error) => {
            console.error("Terjadi kesalahan:", error.message);
            process.exitCode = 1;
        });
    }
}

module.exports = {
    create_db,
    insert_pendaftaran,
    update_html,
    read_aktif
};
