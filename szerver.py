# all the imports
# from __future__ import print_function
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, json, jsonify

import logging
import mysql.connector
import smtplib
#from smtplib import SMTP_SSL


app = Flask(__name__, static_url_path='')
app.secret_key = 'development key'

		
@app.route('/')
def index():
	return app.send_static_file('login.html')

@app.route('/register/', methods = ['POST'])
def register():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok')
	cursor = cnx.cursor()
	table = ''
	
	if adatok['tipus1CB'] == True:
		termelo = 1
	else:
		termelo = 0
	if adatok['tipus2CB'] == True:
		megrendelo = 1
	else:
		megrendelo = 0	
		
	add_user = ("INSERT INTO Szemelyek "
				   "(Nev, Cim, Tel, Email, Jelszo, Admin, Termelo, Megrendelo)"
				   "VALUES (%s, %s, %s, %s, %s, 0, %s, %s)")

	data_user = (adatok['nev'], adatok['cim'], adatok['tel'], adatok['email'], adatok['pass1'], termelo, megrendelo)

	# Insert new user
	cursor.execute(add_user, data_user)
	emp_no = cursor.lastrowid

	# Make sure data is committed to the database
	cnx.commit()
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})


@app.route('/termekfeltoltes/', methods = ['POST'])
def termekfeltoltes():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok')
	cursor = cnx.cursor()
	str = ("INSERT INTO Termekek "
				   "(Nev, Leiras, Ar, Kep, Min_rendelesi_menny, Keszlet_menny, SZ_ID)"
				   "VALUES (%s, %s, %s, %s, %s, %s, %s)")

	datas = (adatok['nev'], adatok['leiras'], adatok['ar'], 'foto.jpg', adatok['rend_menny'], adatok['keszlet_menny'], session['SZ_ID'])

	# Insert new user
	cursor.execute(str, datas)
	emp_no = cursor.lastrowid

	# Make sure data is committed to the database
	cnx.commit()
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})

@app.route('/termekbetoltes/', methods = ['POST'])	
def termekbetoltes():
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
	cursor = cnx.cursor()

	select_termekek = ("SELECT T_ID, Nev, Leiras, Ar, Min_rendelesi_menny, Kep, Keszlet_menny FROM Termekek WHERE SZ_ID = %s")
	select_penznemek = ("SELECT * FROM Penznemek")
	select_mertekegysegek = ("SELECT * FROM Mertekegysegek")
	select_kategoriak = ("SELECT * FROM Kategoriak")
	
	cursor.execute(select_termekek, [session['SZ_ID']])
	cnx.commit()
	termekek = cursor.fetchall()
	logging.warning(termekek)
	
	cursor.execute(select_penznemek)
	cnx.commit()
	ertekek = cursor.fetchall()
	penznemek = []
	for x in ertekek:		
		penznemek.append({'value':x[0], 'text':x[1]})
	logging.warning(penznemek)
	
	cursor.execute(select_mertekegysegek)
	cnx.commit()
	ertekek2 = cursor.fetchall()
	mertekegysegek = []
	for r in ertekek2:
		mertekegysegek.append({'value':r[0], 'text':r[1]})
	logging.warning(mertekegysegek)
	
	cursor.execute(select_kategoriak)
	cnx.commit()
	ertekek3 = cursor.fetchall()
	kategoriak = []
	for r in ertekek3:
		kategoriak.append({'value':r[0], 'text':r[1]})
	logging.warning(kategoriak)
	
	cursor.close()
	cnx.close()
	return jsonify({'termekek':termekek, 'penznemek':penznemek, 'mertekegysegek':mertekegysegek, 'kategoriak':kategoriak})
	

@app.route('/mindentermek/', methods = ['POST'])	
def mindentermek():
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
	cursor = cnx.cursor()

	select_termekek = ("SELECT T_ID, Nev, Leiras, Ar, Min_rendelesi_menny, Kep, Keszlet_menny FROM Termekek")
	
	cursor.execute(select_termekek)
	cnx.commit()
	termekek = cursor.fetchall()
	logging.warning(termekek)
	cursor.close()
	cnx.close()
	return jsonify({'termekek':termekek})


@app.route('/termekmodositas/', methods = ['POST'])
def termekmodositas():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok')
	cursor = cnx.cursor()
	str = ("UPDATE Termekek SET "
				"Nev = %s, Leiras = %s, Ar = %s, Min_rendelesi_menny = %s, Kep = %s, Keszlet_menny = %s, SZ_ID = %s "
				"WHERE T_ID = %s")
	datas = (adatok['nev'], adatok['leiras'], adatok['ar'], adatok['rend_menny'], 'foto.jpg', adatok['keszlet_menny'], adatok['id'], session['SZ_ID'])

	try:
		cursor.execute(str, datas)
		cnx.commit()
	except:
		cnx.rollback()
		
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})

	
@app.route('/termektorles/', methods = ['POST'])	
def termektorles():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
	cursor = cnx.cursor()

	string = ("DELETE FROM Termekek WHERE T_ID = %s")
	cursor.execute(string, [adatok])
	cnx.commit()
	cursor.close()
	cnx.close()
	return jsonify({'success': True})



@app.route('/profilombetoltes/', methods = ['POST'])	
def profilombetoltes():
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
	cursor = cnx.cursor()

	select_profilom = ("SELECT SZ_ID, Nev, Cim, Tel, Email FROM Szemelyek WHERE SZ_ID = %s")
	select_penznemek = ("SELECT P_ID, Penznem FROM Penznemek")
	select_rendszeresseg = ("SELECT R_ID, Nev FROM Rendszeresseg")
	
	cursor.execute(select_profilom, [session['SZ_ID']])
	cnx.commit()
	profilom = cursor.fetchone()
	logging.warning(profilom)
	
	cursor.execute(select_penznemek)
	cnx.commit()
	ertekek = cursor.fetchall()
	penznemek = []
	for x in ertekek:		
		penznemek.append({'value':x[0], 'text':x[1]})
	logging.warning(penznemek)
	
	cursor.execute(select_rendszeresseg)
	cnx.commit()
	ertekek2 = cursor.fetchall()
	rendszeresseg = []
	for r in ertekek2:
		rendszeresseg.append({'value':r[0], 'text':r[1]})
	logging.warning(rendszeresseg)
	
	select_profilom_adatok = ("SELECT * FROM Termelok WHERE SZ_ID = %s")
	cursor.execute(select_profilom_adatok, [session['SZ_ID']])
	cnx.commit()
	profilom_adat = cursor.fetchone()
	logging.warning(profilom_adat)
	
	cursor.close()
	cnx.close()
	return jsonify({'profilom':profilom, 'penznemek':penznemek, 'rendszeresseg':rendszeresseg, 'profilom_adat':profilom_adat})	

@app.route('/profilommodositas/', methods = ['POST'])
def profilommodositas():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
	cursor = cnx.cursor()
	
	str_teszt = ("SELECT * FROM Termelok WHERE SZ_ID = %s")
	cursor.execute(str_teszt, [session['SZ_ID']])
	cnx.commit()
	teszt_eredmeny = cursor.fetchone()
	logging.warning(teszt_eredmeny)
	
	if teszt_eredmeny is None :
		insert_profilom = ("INSERT INTO Termelok (SZ_ID, Kep, Kiszallitasi_dij, Min_vasarloi_kosar, R_ID, P_ID) VALUES (%s, %s, %s, %s, %s, %s) ")
		datas = (session['SZ_ID'], adatok['kep'], adatok['kiszall_dij'], adatok['min_kosar'], adatok['rendszeresseg'], adatok['penznem'])
		logging.warning(datas)
		logging.warning(adatok['selected'])
		try:
			cursor.execute(insert_profilom, datas)
			cnx.commit()
		except:
			cnx.rollback()
			
		#for i in adatok['nap']:
			# insert_napok = ("INSERT INTO Kiszallitasi_napok (SZ_ID, N_ID) VALUES (%s, %s)")
			# datas = (session['SZ_ID'], adatok['nap']['i'])
			# logging.warning(datas)
			# try:
				# cursor.execute(insert_napok, datas)
				# cnx.commit()
			# except:
				# cnx.rollback()
	
	else:
		update_profilom = ("UPDATE Termelok SET Kep = %s, Kiszallitasi_dij = %s, Min_vasarloi_kosar = %s, R_ID = %s, P_ID = %s WHERE SZ_ID = %s")
		datas = (adatok['kep'], adatok['kiszall_dij'], adatok['min_kosar'], adatok['rendszeresseg'], adatok['penznem'], session['SZ_ID'])
		logging.warning(datas)
		logging.warning(adatok['selected'])
		try:
			cursor.execute(update_profilom, datas)
			cnx.commit()
		except:
			cnx.rollback()
			
		for i in adatok['selected']:
			insert_napok = ("INSERT INTO Kiszallitasi_napok (SZ_ID, N_ID) VALUES (%s, %s)")
			datas = (session['SZ_ID'], adatok['selected']['i'])
			logging.warning(datas)
			try:
				cursor.execute(insert_napok, datas)
				cnx.commit()
			except:
				cnx.rollback()	

	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})

	
	
@app.route('/login/', methods = ['POST'])	
def login():
	adat = json.loads(request.data)
	logging.warning(adat)
	
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
	cursor = cnx.cursor()

	cursor.execute("SELECT SZ_ID, Nev, Jelszo, Termelo, Megrendelo FROM Szemelyek WHERE Email = %s", [adat['loginEmail']])
	emp_no = cursor.lastrowid
	
	if emp_no == 0 :
		cnx.commit()
		cursor.close()
		cnx.close()
		return jsonify({'loginSuccess': False})
	else:
		user = cursor.fetchone()
		logging.warning(user)
		if user[2] == adat['loginPass']:
			cnx.commit()
			cursor.close()
			cnx.close()
			session['SZ_ID'] = user[0]
			return jsonify({'user':user, 'loginSuccess': True})
		else:
			cnx.commit()
			cursor.close()
			cnx.close()
			return jsonify({'loginSuccess': False})

			
@app.route('/logout')
def logout():
	if 'SZ_ID' in session:
		session.pop('SZ_ID', None)
	return redirect(url_for('index'))
	

@app.route('/termelo')
def termelo():
	if 'SZ_ID' in session:
		cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
		cursor = cnx.cursor()
		cursor.execute("SELECT Termelo FROM Szemelyek WHERE SZ_ID = %s", [session['SZ_ID']])
		result = cursor.fetchone()
		cursor.close()
		cnx.close()
		if result[0] == 1:
			return app.send_static_file('termelo_fooldal.html')
		else:
			return redirect(url_for('index'))
	else:
		return redirect(url_for('index'))
				
		
@app.route('/megrendelo')
def megrendelo():
	if 'SZ_ID' in session:
		cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
		cursor = cnx.cursor()
		cursor.execute("SELECT Megrendelo FROM Szemelyek WHERE SZ_ID = %s", [session['SZ_ID']])
		result = cursor.fetchone()
		cursor.close()
		cnx.close()
		if result[0] == 1:
			return app.send_static_file('megrendelo_fooldal.html')
		else:
			return redirect(url_for('index'))
	else:
		return redirect(url_for('index'))
	
	

@app.route('/uzenetkuldes/', methods = ['POST'])
def uzenetkuldes():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	
	cnx = mysql.connector.connect(user='root', password='', host='localhost', database='szekelytermelok', buffered=True)
	cursor = cnx.cursor()
	cursor.execute("SELECT Email FROM Szemelyek WHERE SZ_ID = %s", [session['SZ_ID']])

	#FROM = cursor.fetchone()
	
	FROM = "mester.agnes@yahoo.com"
	TO = []				# must be a list
	TO.append(adatok['cimzett'])
	logging.warning(TO)

	SUBJECT = adatok['targy']
	TEXT = adatok['uzenet']

# Prepare actual message
	message = """\
	From: %s
	To: %s
	Subject: %s

	%s
	""" % (FROM, ", ".join(TO), SUBJECT, TEXT)

# Send the mail
#	server = smtplib.SMTP("localhost")
#	server.sendmail(FROM, TO, message)
#	server.quit()	

# The actual mail send
	server = smtplib.SMTP('smtp.gmail.com:25')
	#server = SMTP_SSL("smtp.webfaction.com", 465)
	server.starttls()
	server.sendmail(FROM, TO, message)
	server.quit()
	
	
# Update database
	add_uzenet = ("INSERT INTO Uzenetek "
				   "(Szoveg, Datum, Felado_ID, Cimzett_ID)"
				   "VALUES (%s, %s, %s, %s)")

	data_uzenet = (adatok['uzenet'], adatok['datum'], session['SZ_ID'], '1')

	cursor.execute(add_user, data_user)
	
# Make sure data is committed to the database
	cnx.commit()
	cursor.close()
	cnx.close()
		
	
	return jsonify({'success': True})


	
app.debug = True;


if __name__ == '__main__':
    app.run()
	
