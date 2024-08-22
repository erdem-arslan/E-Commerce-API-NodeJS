# E-commerce Backend Case Study

Bu proje, Node.js kullanılarak geliştirilmiş bir e-ticaret platformunun backend API'sidir. API, ürün yönetimi, alışveriş sepeti işlemleri ve sipariş yönetimi gibi temel e-ticaret işlevlerini sağlamaktadır.

<br>
<br>
<br>

# API Endpoint'leri ve Görevleri

- [Postman Collection](https://documenter.getpostman.com/view/27403848/2sAXjDeb8H)

<br>
<br>
<br>

# Projenin Özellikleri

- **Ürün Yönetimi:** Ürün ekleme, güncelleme, silme ve listeleme işlemleri.
- **Sepet İşlemleri:** Sepete ürün ekleme, sepetten ürün çıkarma, sepeti boşaltma ve toplam fiyat hesaplama.
- **Sipariş Yönetimi:** Sipariş oluşturma, sipariş durumu güncelleme ve siparişleri listeleme.
- **Kimlik Doğrulama:** JWT kullanılarak güvenli kimlik doğrulama.
- **Veritabanı:** MongoDB kullanılarak verilerin saklanması.
- **EventEmitter:** Sipariş oluşturma ve güncelleme işlemleri için olay tetikleme.

<br>
<br>
<br>

# Kurulum ve Çalıştırma

#### 1- Paketleri Yükleyin

```
npm install
```
<br/>

#### 2- MongoDB Sunucusunu Başlatın

```
mongod
```
<br/>

#### 3- .env Dosyasını Oluştururn

Proje kök dizininde .env dosyasını oluşturun ve aşağıdaki bilgileri ekleyin:

```javascript
PORT=3000
DB_URI=mongodb://localhost:27017/e-commerce
JWT_SECRET=your_secret_key
```
<br/>

#### 4- Projeyi Başlatın

```
node index.js
```
<br/>

#### 4- Projeyi Başlatın

Postman'de aşağıda belirtilen endpoint'leri test edebilirsiniz. Sipariş işlemleri için JWT token'ı header'a ekleyin:

```
Authorization Bearer <JWT_TOKEN>
```


