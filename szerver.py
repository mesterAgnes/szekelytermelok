# all the imports
# from __future__ import print_function
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, json, jsonify

 
import logging
import mysql.connector

app = Flask(__name__, static_url_path='')

		
@app.route('/')
def index():
	return app.send_static_file('index.html')

@app.route('/register/', methods = ['POST'])
def register():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok')
	cursor = cnx.cursor()
	table = ''
	if adatok['tipus'] == 'Termelo':
		table = 'Termelok'
	else:
		table = 'Vasarlok'
	add_user = ("INSERT INTO " + table + " "
				   "(Nev, Cim, Tel, Email, Jelszo)"
				   "VALUES (%s, %s, %s, %s, %s)")

	data_user = (adatok['nev'], adatok['cim'], adatok['tel'], adatok['email'], adatok['pass1'])

	# Insert new user
	cursor.execute(add_user, data_user)
	emp_no = cursor.lastrowid

	# Make sure data is committed to the database
	cnx.commit()
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})

@app.route('/login/', methods = ['POST'])	
def login():
	adat = json.loads(request.data)
	logging.warning(adat)
	
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
	cursor = cnx.cursor()

	if adat['loginStatus'] == "Megrendelo":
		select_megrendelo = ("SELECT V_ID, Nev, Jelszo FROM Vasarlok WHERE Email like %s")
		data_megrendelo = adat['loginEmail']
		
		cursor.execute("SELECT V_ID, Nev, Jelszo FROM Vasarlok WHERE Email = %s", (adat['loginEmail']))
		emp_no = cursor.lastrowid
		
		if emp_no == 0 :
			cnx.commit()
			cursor.close()
			cnx.close()
			return jsonify({'loginSuccess': False})
		else:
			user = cursor.fetchone()
			if user['Jelszo'] == adat['loginPass'] :
				cnx.commit()
				cursor.close()
				cnx.close()
				return jsonify(user)
			else:
				cnx.commit()
				cursor.close()
				cnx.close()
				return jsonify({'loginSuccess': False})
				
	if adat['loginStatus'] == "Termelo":
		select_termelo = ("SELECT T_ID, Nev, Jelszo FROM Termelok WHERE Email like %s")
		data_termelo = adat['loginEmail']
		
		cursor.execute("SELECT T_ID, Nev, Jelszo FROM Termelok WHERE Email = %s", [adat['loginEmail']])
		emp_no = cursor.lastrowid
		
		if emp_no == 0 :
			cnx.commit()
			cursor.close()
			cnx.close()
			return jsonify({'loginSuccess': False})
		else:
			user = cursor.fetchone()
			logging.warning(user)
			if user[2] == adat['loginPass'] :
				cnx.commit()
				cursor.close()
				cnx.close()
				return jsonify({'user': user, 'loginSuccess': True})
			else:
				cnx.commit()
				cursor.close()
				cnx.close()
				return jsonify({'loginSuccess': False})	
		
app.debug = True;

if __name__ == '__main__':
    app.run()
	
