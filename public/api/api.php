<?php
/**
 * Auto Limpeza Pro - Backend API
 * Gerencia agendamentos, leads, blog e analytics em MySQL
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Configuração do Banco de Dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'will3269_autolimpezapro001');
define('DB_USER', 'will3269_autolimpezapro001');
define('DB_PASS', 'O3nVPNAz}~+t');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Falha na conexão com o banco de dados: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'appointments':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO appointments (client_name, client_phone, client_address, services, date, time, status, employee, duration, latitude, longitude, access_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['client_name'],
                $data['client_phone'],
                $data['client_address'],
                is_array($data['services']) ? json_encode($data['services']) : $data['services'],
                $data['date'],
                $data['time'],
                $data['status'] ?? 'pending',
                $data['employee'] ?? 'A definir',
                $data['duration'] ?? 0,
                $data['latitude'] ?? null,
                $data['longitude'] ?? null,
                $data['access_token'] ?? null
            ]);
            $data['id'] = $pdo->lastInsertId();
            echo json_encode($data);
        } else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE appointments SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(['success' => true]);
        } else {
            $token = $_GET['token'] ?? null;
            if ($token) {
                $stmt = $pdo->prepare("SELECT * FROM appointments WHERE access_token = ?");
                $stmt->execute([$token]);
                $result = $stmt->fetch();
                echo json_encode($result ?: null);
            } else {
                $stmt = $pdo->query("SELECT * FROM appointments ORDER BY date DESC, time DESC");
                echo json_encode($stmt->fetchAll());
            }
        }
        break;

    case 'leads':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO leads (name, phone, email, source, status) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['phone'],
                $data['email'] ?? '',
                $data['source'] ?? 'Site',
                $data['status'] ?? 'new'
            ]);
            $data['id'] = $pdo->lastInsertId();
            $data['created_at'] = date('Y-m-d H:i:s');
            echo json_encode($data);
        } else {
            $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll());
        }
        break;

    case 'blog':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO blog_posts (title, content, slug, excerpt, image_url, category) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['title'],
                $data['content'],
                $data['slug'],
                $data['excerpt'] ?? '',
                $data['image_url'] ?? '',
                $data['category'] ?? 'Geral'
            ]);
            $data['id'] = $pdo->lastInsertId();
            echo json_encode($data);
        } else {
            $stmt = $pdo->query("SELECT * FROM blog_posts ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll());
        }
        break;

    case 'login':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data['username'] === 'proclean@2026' && $data['password'] === 'limpeza@2026') {
            echo json_encode(['success' => true, 'token' => bin2hex(random_bytes(16))]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Credenciais inválidas']);
        }
        break;

    case 'analytics':
        // Simples retorno de estatísticas para o painel
        $stats = [
            'total_appointments' => $pdo->query("SELECT COUNT(*) FROM appointments")->fetchColumn(),
            'pending_appointments' => $pdo->query("SELECT COUNT(*) FROM appointments WHERE status = 'pending'")->fetchColumn(),
            'total_leads' => $pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn(),
            'total_sales' => $pdo->query("SELECT COUNT(*) FROM sales")->fetchColumn() ?? 0
        ];
        echo json_encode($stats);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Ação não encontrada: ' . $action]);
        break;
}
