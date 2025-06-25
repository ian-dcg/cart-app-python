#!/bin/bash

echo "🔍 Rodando flake8..."
flake8 app tests

echo "🎨 Rodando black..."
black app tests

echo "📦 Rodando isort..."
isort app tests
