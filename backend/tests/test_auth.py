import time
def test_register_user(client):
    payload = {
        "name": "John Doe",
        "email": "john.doe@gmail.com",
        "password": "securepassword",
        "phone": "123456789"
    }
    response = client.post('/auth/register', json=payload)
    print(response.get_data())  # Dodaj to, aby zobaczyć szczegóły odpowiedzi
    assert response.status_code == 201

def test_login_user(client):
    """Testowanie logowania użytkownika."""
    # Rejestracja użytkownika
    client.post('/auth/register', json={
        "name": "Jane Doe",
        "email": "jane.doe@gmail.com",
        "password": "securepassword",
        "phone": "987654321"
    })
    time.sleep(1)

    # Logowanie użytkownika
    response = client.post('/auth/login', json={
        "email": "jane.doe@gmail.com",
        "password": "securepassword"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_register_existing_user(client):
    """Testowanie rejestracji już istniejącego użytkownika."""
    # Rejestracja użytkownika
    client.post('/auth/register', json={
        "name": "Existing User",
        "email": "existing@gmail.com",
        "password": "password123",
        "phone": "123456789"
    })

    # Próba ponownej rejestracji
    response = client.post('/auth/register', json={
        "name": "Existing User",
        "email": "existing@gmail.com",
        "password": "password123",
        "phone": "123456789"
    })
    assert response.status_code == 400
    assert response.get_json()['message'] == 'User already exists'
