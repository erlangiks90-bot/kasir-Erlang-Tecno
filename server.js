```javascript
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= PUBLIC FOLDER =================
app.use(express.static(path.join(__dirname, "public")));

// ================= DATABASE SEMENTARA =================
let produk = [
    {
        id: 1,
        nama: "Indomie Goreng",
        harga: 3500,
        stok: 50
    },
    {
        id: 2,
        nama: "Aqua Botol",
        harga: 4000,
        stok: 40
    },
    {
        id: 3,
        nama: "Teh Pucuk",
        harga: 5000,
        stok: 30
    }
];

let transaksi = [];

// ================= USER LOGIN =================
const users = [
    {
        username: "admin",
        password: "123",
        role: "admin"
    },
    {
        username: "kasir",
        password: "123",
        role: "kasir"
    }
];

// ================= LOGIN =================
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const user = users.find(
        u =>
            u.username === username &&
            u.password === password
    );

    if (user) {

        res.json({
            success: true,
            role: user.role
        });

    } else {

        res.json({
            success: false,
            message: "Login gagal"
        });

    }

});

// ================= GET PRODUK =================
app.get("/produk", (req, res) => {

    res.json(produk);

});

// ================= TAMBAH PRODUK =================
app.post("/produk", (req, res) => {

    const data = {
        id: Date.now(),
        nama: req.body.nama,
        harga: Number(req.body.harga),
        stok: Number(req.body.stok)
    };

    produk.push(data);

    res.json({
        success: true,
        produk
    });

});

// ================= HAPUS PRODUK =================
app.delete("/produk/:id", (req, res) => {

    const id = Number(req.params.id);

    produk = produk.filter(
        p => p.id !== id
    );

    res.json({
        success: true,
        produk
    });

});

// ================= UPDATE STOK =================
app.put("/produk/:id", (req, res) => {

    const id = Number(req.params.id);

    const item = produk.find(
        p => p.id === id
    );

    if (item) {

        item.nama = req.body.nama || item.nama;

        item.harga = Number(req.body.harga) || item.harga;

        item.stok = Number(req.body.stok) || item.stok;

        res.json({
            success: true,
            produk
        });

    } else {

        res.json({
            success: false,
            message: "Produk tidak ditemukan"
        });

    }

});

// ================= TRANSAKSI =================
app.post("/transaksi", (req, res) => {

    const {
        cart,
        total,
        bayar,
        kembali
    } = req.body;

    const data = {
        id: Date.now(),
        cart,
        total,
        bayar,
        kembali,
        tanggal: new Date().toLocaleString()
    };

    transaksi.push(data);

    // KURANGI STOK
    cart.forEach(item => {

        const produkCari = produk.find(
            p => p.id === item.id
        );

        if (produkCari) {

            produkCari.stok -= item.qty;

            if (produkCari.stok < 0) {
                produkCari.stok = 0;
            }

        }

    });

    res.json({
        success: true,
        transaksi: data
    });

});

// ================= GET TRANSAKSI =================
app.get("/transaksi", (req, res) => {

    res.json(transaksi);

});

// ================= LAPORAN =================
app.get("/laporan", (req, res) => {

    let totalPenjualan = 0;

    transaksi.forEach(t => {
        totalPenjualan += t.total;
    });

    res.json({
        jumlahTransaksi: transaksi.length,
        totalPenjualan
    });

});

// ================= HOME =================
app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});

// ================= ADMIN PAGE =================
app.get("/admin", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "admin.html"
        )
    );

});

// ================= KASIR PAGE =================
app.get("/kasir", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "kasir.html"
        )
    );

});

// ================= SERVER ONLINE =================
app.listen(PORT, "0.0.0.0", () => {

    console.log("====================================");
    console.log("🔥 KASIR ERLANG TECNO ONLINE");
    console.log("🌍 SERVER BERHASIL BERJALAN");
    console.log("🚀 PORT : " + PORT);
    console.log("====================================");

});
```
