<?php
require "dbconfig.php";

// Ajouter une nouvelle tâche
if (isset($_POST["action"]) && $_POST["action"] == "add") {
    $task_name = $_POST["task_name"];
    $sql = "INSERT INTO tasks (task_name) VALUES ('$task_name')";
    $conn->query($sql);
    $task_id = $conn->insert_id;  // Récupère l'ID de la tâche nouvellement créée
    echo json_encode(["status" => "success", "task_id" => $task_id]);
}
// Marquer une tâche comme terminée
if (isset($_POST["action"]) && $_POST["action"] == "complete") {
    $task_id = $_POST["task_id"];
    $sql = "UPDATE tasks SET status=1 WHERE id=$task_id";
    $conn->query($sql);
    echo json_encode(["status" => "success"]);
}

// Supprimer une tâche
if (isset($_POST["action"]) && $_POST["action"] == "delete") {
    $task_id = $_POST["task_id"];
    $sql = "DELETE FROM tasks WHERE id=$task_id";
    $conn->query($sql);
    echo json_encode(["status" => "success"]);
}

$conn->close();

//Affichage et tri des taches
if (isset($_GET["action"]) && $_GET["action"] == "list") {
    $tasks = [];
    $order = isset($_GET["order"]) && $_GET["order"] == "desc" ? "DESC" : "ASC";
    $sql = "SELECT id, task_name, creation_date FROM tasks WHERE status=0 ORDER BY creation_date $order";  // Tri selon l'ordre choisi
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
    echo json_encode($tasks);
}
?>