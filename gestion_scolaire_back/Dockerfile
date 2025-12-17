# ---------------------------
# 🏗️ Étape 1 : Build du projet
# ---------------------------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copier le fichier pom.xml pour télécharger les dépendances (utilise le cache Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copier le reste du code source
COPY src ./src

# Compiler le projet et créer le fichier JAR
RUN mvn clean package -DskipTests

# ---------------------------
# 🚀 Étape 2 : Exécution
# ---------------------------
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copier le JAR généré depuis l’étape précédente
COPY --from=build /app/target/*.jar app.jar

# Exposer le port du backend (Spring Boot)
EXPOSE 8080

# Commande pour démarrer l’application
ENTRYPOINT ["java", "-jar", "app.jar"]
