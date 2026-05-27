<?php
/**
 * Auto Limpeza Pro - Backend API v2.0
 * Centraliza toda a lógica de persistência em MySQL (cPanel/HostGator)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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

    // Auto-criação de tabelas básicas se não existirem
    $pdo->exec("CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50),
        client_address TEXT,
        services TEXT,
        date DATE,
        time TIME,
        status VARCHAR(50) DEFAULT 'pending',
        employee VARCHAR(100),
        duration INT DEFAULT 0,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        access_token VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        source VARCHAR(100),
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        items TEXT,
        total DECIMAL(10, 2),
        payment_method VARCHAR(50),
        type VARCHAR(50),
        client_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS cash_operations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50),
        description TEXT,
        amount DECIMAL(10, 2),
        time VARCHAR(10),
        sale_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100),
        path VARCHAR(255),
        referrer TEXT,
        source_category VARCHAR(100),
        source_name VARCHAR(100),
        user_agent TEXT,
        device_type VARCHAR(50),
        browser VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS conversion_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100),
        event_name VARCHAR(100),
        event_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT,
        excerpt TEXT,
        image_url TEXT,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $action = $_GET['action'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($action) {
        case 'appointments':
            if ($method === 'POST') {
                $stmt = $pdo->prepare("INSERT INTO appointments (client_name, client_phone, client_address, services, date, time, status, employee, duration, latitude, longitude, access_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $input['client_name'],
                    $input['client_phone'],
                    $input['client_address'],
                    is_array($input['services']) ? json_encode($input['services']) : $input['services'],
                    $input['date'],
                    $input['time'],
                    $input['status'] ?? 'pending',
                    $input['employee'] ?? 'A definir',
                    $input['duration'] ?? 0,
                    $input['latitude'] ?? null,
                    $input['longitude'] ?? null,
                    $input['access_token'] ?? null
                ]);
                $input['id'] = $pdo->lastInsertId();
                echo json_encode($input);
            } elseif ($method === 'PATCH') {
                $stmt = $pdo->prepare("UPDATE appointments SET status = ? WHERE id = ?");
                $stmt->execute([$input['status'], $input['id']]);
                echo json_encode(['success' => true]);
            } else {
                $token = $_GET['token'] ?? null;
                if ($token) {
                    $stmt = $pdo->prepare("SELECT * FROM appointments WHERE access_token = ?");
                    $stmt->execute([$token]);
                    echo json_encode($stmt->fetch() ?: null);
                } else {
                    $stmt = $pdo->query("SELECT * FROM appointments ORDER BY date DESC, time DESC");
                    echo json_encode($stmt->fetchAll());
                }
            }
            break;

        case 'sales':
        case 'sales_create':
            if ($method === 'POST') {
                $stmt = $pdo->prepare("INSERT INTO sales (items, total, payment_method, type, client_name) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([
                    is_array($input['items']) ? json_encode($input['items']) : $input['items'],
                    $input['total'],
                    $input['payment_method'],
                    $input['type'],
                    $input['client_name']
                ]);
                $input['id'] = $pdo->lastInsertId();
                $input['created_at'] = date('c');
                echo json_encode($input);
            } else {
                $stmt = $pdo->query("SELECT * FROM sales ORDER BY created_at DESC");
                echo json_encode($stmt->fetchAll());
            }
            break;

        case 'cash_operations':
        case 'cash_operations_create':
            if ($method === 'POST') {
                $stmt = $pdo->prepare("INSERT INTO cash_operations (type, description, amount, time, sale_id) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([
                    $input['type'],
                    $input['description'],
                    $input['amount'],
                    $input['time'],
                    $input['sale_id'] ?? null
                ]);
                $input['id'] = $pdo->lastInsertId();
                echo json_encode($input);
            } else {
                $stmt = $pdo->query("SELECT * FROM cash_operations ORDER BY created_at DESC");
                echo json_encode($stmt->fetchAll());
            }
            break;

        case 'leads':
            if ($method === 'POST') {
                $stmt = $pdo->prepare("INSERT INTO leads (name, phone, email, source, status) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([
                    $input['name'],
                    $input['phone'],
                    $input['email'] ?? '',
                    $input['source'] ?? 'Site',
                    $input['status'] ?? 'new'
                ]);
                $input['id'] = $pdo->lastInsertId();
                $input['created_at'] = date('Y-m-d H:i:s');
                echo json_encode($input);
            } else {
                $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
                echo json_encode($stmt->fetchAll());
            }
            break;

        case 'blog':
            if ($method === 'POST') {
                $stmt = $pdo->prepare("INSERT INTO blog_posts (title, content, slug, excerpt, image_url, category) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $input['title'],
                    $input['content'],
                    $input['slug'],
                    $input['excerpt'] ?? '',
                    $input['image_url'] ?? '',
                    $input['category'] ?? 'Geral'
                ]);
                $input['id'] = $pdo->lastInsertId();
                echo json_encode($input);
            } else {
                $stmt = $pdo->query("SELECT * FROM blog_posts ORDER BY created_at DESC");
                echo json_encode($stmt->fetchAll());
            }
            break;

        case 'login':
            if ($input['username'] === 'proclean@2026' && $input['password'] === 'limpeza@2026') {
                echo json_encode(['success' => true, 'token' => bin2hex(random_bytes(16))]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciais inválidas']);
            }
            break;

        case 'track_visit':
            $stmt = $pdo->prepare("INSERT INTO visitors (session_id, path, referrer, source_category, source_name, user_agent, device_type, browser) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['session_id'],
                $input['path'],
                $input['referrer'] ?? null,
                $input['source_category'],
                $input['source_name'] ?? null,
                $input['user_agent'],
                $input['device_type'],
                $input['browser']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'track_event':
            $stmt = $pdo->prepare("INSERT INTO conversion_events (session_id, event_name, event_data) VALUES (?, ?, ?)");
            $stmt->execute([
                $input['session_id'],
                $input['event_name'],
                is_array($input['event_data']) ? json_encode($input['event_data']) : $input['event_data']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'analytics':
            $visits = $pdo->query("SELECT * FROM visitors ORDER BY created_at DESC LIMIT 2000")->fetchAll();
            $events = $pdo->query("SELECT * FROM conversion_events ORDER BY created_at DESC LIMIT 1000")->fetchAll();
            $total_appointments = $pdo->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
            $total_leads = $pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn();
            
            echo json_encode([
                'visits' => $visits,
                'events' => $events,
                'summary' => [
                    'total_appointments' => (int)$total_appointments,
                    'total_leads' => (int)$total_leads,
                ]
            ]);
            break;

        case 'chat_atendimento':
            // Placeholder para relay de chat IA se necessário futuramente
            echo json_encode(['choices' => [['delta' => ['content' => "Olá! No momento estamos em manutenção do chat IA. Por favor, utilize o WhatsApp para um atendimento imediato."]]]]);
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Ação não encontrada: ' . $action]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro interno no servidor',
        'message' => $e->getMessage()
    ]);
}
