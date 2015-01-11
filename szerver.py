# all the imports
# from __future__ import print_function
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, json, jsonify, send_from_directory
from werkzeug import secure_filename
from datetime import datetime
	 
import os
import logging
import smtplib
#from smtplib import SMTP_SSL

import config
import mysql.connector


app = Flask(__name__, static_url_path='')
app.secret_key = 'development key'

# This is the path to the upload directory
app.config['UPLOAD_FOLDER'] = 'static/img/logos/'

# These are the extension that we are accepting to be uploaded
app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'gif'])

# For a given file, return whether it's an allowed type or not
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


conf = config.Config()

		   
@app.route('/')
def index():
	return app.send_static_file('login.html')

@app.route('/register/', methods = ['POST'])
def register():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database)
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
	cnx.commit()
	
	logo='logo'+str(emp_no)+'.jpg'
	if os.path.exists('static/img/logos/logo.jpg'):
		os.rename('static/img/logos/logo.jpg','static/img/logos/'+logo)
	
	# Make sure data is committed to the database
	cnx.commit()
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})

	
# Route that will process the file upload
@app.route('/upload', methods=['POST'])
def upload():
    # Get the name of the uploaded file
    file = request.files['file']
    # Check if the file is one of the allowed types/extensions
    if file and allowed_file(file.filename):
        # Make the filename safe, remove unsupported chars
        # filename = secure_filename(file.filename)
        filename = 'logo.jpg'
        # Move the file form the temporal folder to
        # the upload folder we setup
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # Redirect the user to the uploaded_file route, which
        # will basicaly show on the browser the uploaded file
    return redirect(url_for('termelo'))
		
# This route is expecting a parameter containing the name
# of a file. Then it will locate that file on the upload
# directory and show it on the browser, so if the user uploads
# an image, that image is going to be show after the upload
# @app.route('/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)	

							   
@app.route('/termekfeltoltes/', methods = ['POST'])
def termekfeltoltes():
	adatok = json.loads(request.data)
	# logging.warning(adatok)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database)
	cursor = cnx.cursor()
	string = ("INSERT INTO Termekek "
				   "(Nev, Leiras, Ar, Min_rendelesi_menny, Kep, Keszlet_menny, SZ_ID)"
				   "VALUES (%s, %s, %s, %s, %s, %s, %s)")

	datas = (adatok['nev'], adatok['leiras'], adatok['ar'], adatok['rend_menny'], 'termek.jpg', adatok['keszlet_menny'], session['SZ_ID'])

	# Insert new user
	cursor.execute(string, datas)
	emp_no = cursor.lastrowid
	cnx.commit()
	
	add_termek_kep = ("UPDATE Termekek SET KEP=%s WHERE T_ID=%s")
	termek_kep='termek'+str(emp_no)+'.jpg'
	cursor.execute(add_termek_kep, (termek_kep, emp_no))
	cnx.commit()
	if os.path.exists('static/img/termekek/termek.jpg'):
		os.rename('static/img/termekek/termek.jpg','static/img/termekek/' + termek_kep)
	
	# Make sure data is committed to the database
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})

# This is the path to the upload directory
app.config['UPLOAD_FOLDER2'] = 'static/img/termekek/'

@app.route('/termek_upload', methods=['POST'])
def termek_upload():
    # Get the name of the uploaded file
    t_file = request.files['t_file']
    # Check if the file is one of the allowed types/extensions
    if t_file and allowed_file(t_file.filename):
        # Make the filename safe, remove unsupported chars
        # filename = secure_filename(file.filename)
        t_filename = 'termek.jpg'
        # Move the file form the temporal folder to
        # the upload folder we setup
        t_file.save(os.path.join(app.config['UPLOAD_FOLDER2'], t_filename))
        # Redirect the user to the uploaded_file route, which
        # will basicaly show on the browser the uploaded file
    return jsonify({'success': True})
		
# This route is expecting a parameter containing the name
# of a file. Then it will locate that file on the upload
# directory and show it on the browser, so if the user uploads
# an image, that image is going to be show after the upload
# @app.route('/static/img/logos/<filename>')
def uploaded_logo_file(t_filename):
    return send_from_directory(app.config['UPLOAD_FOLDER2'],
                               t_filename)
	
def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj
	
@app.route('/rendeleseim/', methods = ['POST'])	
def rendeleseim():
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	rendelesek = ( "SELECT T_ID, Mennyiseg, Ar FROM Megrendelesek "
					"WHERE Rendelo_ID=%s")				
	cursor.execute(rendelesek,[session['SZ_ID']])
	cnx.commit()
	rendeleseim = cursor.fetchall()
	logging.warning(rendeleseim)
	datum = ( "SELECT Datum FROM Megrendelesek "
				"WHERE Rendelo_ID=%s")
	cursor.execute(datum,[session['SZ_ID']])
	cnx.commit()
	datumok = cursor.fetchall()
	datumok = json.dumps(datumok, default=date_handler)
	dat = datumok.split(",")
	i=0
	for d in dat:
		if i == len(dat)-1:
			dat[i]=dat[i][:-3][3:]
		else:
			dat[i]=dat[i][:-2][3:]
		i=i+1
		
	statuszid = ( "SELECT ST_ID FROM Megrendelesek "
				"WHERE Rendelo_ID=%s")
	cursor.execute(statuszid,[session['SZ_ID']])
	cnx.commit()
	statuszidk = cursor.fetchall()
	
	id = ( "SELECT T_ID FROM Megrendelesek "
			"WHERE Rendelo_ID=%s")
	cursor.execute(id,[session['SZ_ID']])
	cnx.commit()
	idk = cursor.fetchall()
	termeknevek = []
	penznemek = []
	mertekegysegek = []
	statuszok = []

	j=0
	for ids in idk:
		i=int(str(ids).strip("(,), \,"))
		
		nevek = ( "SELECT Nev FROM Termekek WHERE T_ID = %s")
		cursor.execute(nevek,[i])
		nev=cursor.fetchall()
		nev=str(nev).strip("[,],\",\,,(,),\'")
		termeknevek.append(nev)
		
		midk = ( "SELECT ME_ID FROM Termekek WHERE T_ID=%s")
		cursor.execute(midk,[i])
		mid = cursor.fetchall()
		
		szidk = ( "SELECT Rendelo_ID FROM Megrendelesek WHERE T_ID=%s")
		cursor.execute(szidk,[i])
		szid = cursor.fetchall()
		
		pidk = ( "SELECT P_ID FROM Termelok WHERE SZ_ID=%s")
		cursor.execute(pidk,[szid[0][0]])
		pid = cursor.fetchall()
		
		penz = ( "SELECT Penznem FROM Penznemek WHERE P_ID=%s")
		cursor.execute(penz,[pid[0][0]])
		penznem = cursor.fetchall()
		penznem=str(penznem).strip("[,],\",\,,(,),\'")
		penznemek.append(penznem)
		
		mertek = ( "SELECT Nev FROM Mertekegysegek WHERE ME_ID=%s")
		cursor.execute(mertek,[mid[0][0]])
		mertekegyseg = cursor.fetchall()
		mertekegyseg=str(mertekegyseg).strip("[,],\",\,,(,),\'")
		mertekegysegek.append(mertekegyseg)
		
		statusz = ( "SELECT Nev FROM Statuszok WHERE ST_ID=%s")
		cursor.execute(statusz,statuszidk[j])
		j=j+1
		statusz1 = cursor.fetchall()
		statusz1=str(statusz1).strip("[,],\",\,,(,),\'")
		statuszok.append(statusz1)
		
	cursor.close()
	cnx.close()
	return jsonify({'rendeleseim':rendeleseim, 'datumok': dat, 'termeknevek':termeknevek, 'penznemek': penznemek, 'mertekegysegek': mertekegysegek, 'statuszok': statuszok})

@app.route('/megrendeleseim/', methods = ['POST'])	
def megrendeleseim():
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	rendelesek = ("SELECT m.M_ID, m.Mennyiseg, m.ST_ID, m.Ar "
					"FROM Termekek t, Szemelyek sz, Megrendelesek m "
					"WHERE sz.SZ_ID=t.SZ_ID and m.T_ID=t.T_ID and t.SZ_ID = %s")				
	cursor.execute(rendelesek,[session['SZ_ID']])
	cnx.commit()
	rendeleseim = cursor.fetchall()
	
	datum = ("SELECT m.Datum "
			"FROM Termekek t, Szemelyek sz, Megrendelesek m "
			"WHERE sz.SZ_ID=t.SZ_ID and m.T_ID=t.T_ID and t.SZ_ID = %s")
	cursor.execute(datum,[session['SZ_ID']])
	cnx.commit()
	datumok = cursor.fetchall()
	datumok = json.dumps(datumok, default=date_handler)
	dat = datumok.split(",")
	i=0
	for d in dat:
		if i == len(dat)-1:
			dat[i]=dat[i][:-3][3:]
		else:
			dat[i]=dat[i][:-2][3:]
		i=i+1
	
	
	statuszid = ("SELECT m.ST_ID "
			"FROM Termekek t, Szemelyek sz, Megrendelesek m "
			"WHERE sz.SZ_ID=t.SZ_ID and m.T_ID=t.T_ID and t.SZ_ID = %s")
	cursor.execute(statuszid,[session['SZ_ID']])
	cnx.commit()
	statuszidk = cursor.fetchall()
	
	id = ("SELECT m.T_ID "
		"FROM Termekek t, Szemelyek sz, Megrendelesek m "
		"WHERE sz.SZ_ID=t.SZ_ID and m.T_ID=t.T_ID and t.SZ_ID = %s")
	cursor.execute(id,[session['SZ_ID']])
	cnx.commit()
	idk = cursor.fetchall()
	termeknevek = []
	penznemek = []
	mertekegysegek = []
	megrendelonevek = []
	statuszok = []
	osszesstatusz = []
	
	ostatusz = ( "SELECT Nev FROM Statuszok")
	cursor.execute(ostatusz)
	osszstatusz = cursor.fetchall()
	for s in osszstatusz:
		s=str(s).strip("[,],\",\,,(,),\'")
		osszesstatusz.append(s)
	
	j=0
	for ids in idk:
		i=int(str(ids).strip("(,), \,"))
		sql = ( "SELECT Nev FROM Termekek WHERE T_ID = %s")
		cursor.execute(sql,[i])
		nev=cursor.fetchall()
		nev=str(nev).strip("[,],\",\,,(,),\'")
		termeknevek.append(nev)
		
		midk = ( "SELECT ME_ID FROM Termekek WHERE T_ID=%s")
		cursor.execute(midk,[i])
		mid = cursor.fetchall()
		
		szidk = ( "SELECT Rendelo_ID FROM Megrendelesek WHERE T_ID=%s")
		cursor.execute(szidk,[i])
		szid = cursor.fetchall()
		
		pidk = ( "SELECT P_ID FROM Termelok WHERE SZ_ID=%s")
		cursor.execute(pidk,[szid[0][0]])
		pid = cursor.fetchall()
		
		penz = ( "SELECT Penznem FROM Penznemek WHERE P_ID=%s")
		cursor.execute(penz,[pid[0][0]])
		penznem = cursor.fetchall()
		penznem=str(penznem).strip("[,],\",\,,(,),\'")
		penznemek.append(penznem)
		
		mertek = ( "SELECT Nev FROM Mertekegysegek WHERE ME_ID=%s")
		cursor.execute(mertek,[mid[0][0]])
		mertekegyseg = cursor.fetchall()
		mertekegyseg=str(mertekegyseg).strip("[,],\",\,,(,),\'")
		mertekegysegek.append(mertekegyseg)
		
		mnev = ( "SELECT Nev FROM Szemelyek WHERE SZ_ID=%s")
		cursor.execute(mnev,[szid[0][0]])
		mnevek = cursor.fetchall()
		mnevek=str(mnevek).strip("[,],\",\,,(,),\'")
		megrendelonevek.append(mnevek)
		
		statusz = ( "SELECT Nev FROM Statuszok WHERE ST_ID=%s")
		cursor.execute(statusz,statuszidk[j])
		j=j+1
		statusz1 = cursor.fetchall()
		statusz1=str(statusz1).strip("[,],\",\,,(,),\'")
		statuszok.append(statusz1)
		
	cursor.close()
	cnx.close()
	return jsonify({'rendeleseim':rendeleseim, 'datumok': dat, 'termeknevek':termeknevek, 'penznemek': penznemek, 'mertekegysegek': mertekegysegek,'megrendelonevek': megrendelonevek, 'statuszok':statuszok,'osszstat': osszesstatusz})
	
@app.route('/megrendelesMent/', methods = ['POST'])	
def megrendelesMent():
	adatok = json.loads(request.data)
	
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database)
	cursor = cnx.cursor()
	
	string = ("UPDATE Megrendelesek SET "
				"ST_ID = %s"
				"WHERE M_ID = %s")
				
	logging.warning(adatok['id'])
	logging.warning(adatok['statusz'])
	datas = (str(adatok['statusz']), adatok['id'])
	
	try:
		cursor.execute(string, datas)
		cnx.commit()
	except:
		cnx.rollback()
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})	
	
	
	
@app.route('/termekbetoltes/', methods = ['POST'])	
def termekbetoltes():
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	select_termekek = ("SELECT T_ID, Nev, Leiras, Ar, Min_rendelesi_menny, Kep, Keszlet_menny FROM Termekek WHERE SZ_ID = %s")
	select_penznemek = ("SELECT * FROM Penznemek")
	select_mertekegysegek = ("SELECT * FROM Mertekegysegek")
	select_kategoriak = ("SELECT * FROM Kategoriak")
	
	cursor.execute(select_termekek, [session['SZ_ID']])
	cnx.commit()
	termekek = cursor.fetchall()
	# logging.warning(termekek)
	
	cursor.execute(select_penznemek)
	cnx.commit()
	ertekek = cursor.fetchall()
	penznemek = []
	for x in ertekek:		
		penznemek.append({'value':x[0], 'text':x[1]})
	# logging.warning(penznemek)
	
	cursor.execute(select_mertekegysegek)
	cnx.commit()
	ertekek2 = cursor.fetchall()
	mertekegysegek = []
	for r in ertekek2:
		mertekegysegek.append({'value':r[0], 'text':r[1]})
	# logging.warning(mertekegysegek)
	
	cursor.execute(select_kategoriak)
	cnx.commit()
	ertekek3 = cursor.fetchall()
	kategoriak = []
	for r in ertekek3:
		kategoriak.append({'value':r[0], 'text':r[1]})
	# logging.warning(kategoriak)
	
	cursor.close()
	cnx.close()
	return jsonify({'termekek':termekek, 'penznemek':penznemek, 'mertekegysegek':mertekegysegek, 'kategoriak':kategoriak})

	

	
@app.route('/mindentermek/', methods = ['POST'])	
def mindentermek():
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	# a promocios termekek lekerdezese: 
	select_promok = ("SELECT t.T_ID, t.Nev, pr.Ar, Kep, sz.Nev, Penznem, Keszlet_menny "
					"FROM Termekek t, Szemelyek sz, Penznemek p, Promociok pr "
					"WHERE sz.SZ_ID=t.SZ_ID and p.P_ID=t.P_ID and pr.T_ID=t.T_ID and t.T_ID IN (SELECT T_ID FROM promociok)")
	cursor.execute(select_promok)
	cnx.commit()
	promok = cursor.fetchall()
		
	# a NEM promocios termekek lekerdezese: 
	select_nempromok =  ("SELECT T_ID, t.Nev, t.Ar, t.Kep, sz.Nev, Penznem, Keszlet_menny "
						"FROM Termekek t, Szemelyek sz, Penznemek p "
						"WHERE sz.SZ_ID=t.SZ_ID and p.P_ID=t.P_ID and T_ID NOT IN (SELECT T_ID FROM Promociok)")
	
	cursor.execute(select_nempromok)
	cnx.commit()
	termekek = cursor.fetchall()
	
	logging.warning(promok)
	logging.warning(termekek)
	
	cursor.close()
	cnx.close()

	return jsonify({'termekek':termekek, 'promok':promok})	 # minden termek, promociosak es nem promociosak

	
@app.route('/mindenpromtermek/', methods = ['POST'])	
def mindenpromtermek():
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	select_termekek = ( "SELECT t.T_ID, t.Nev, pr.Ar, t.Kep, sz.Nev, Penznem, Keszlet_menny "
						"FROM Termekek t, Szemelyek sz, Penznemek p, Promociok pr "
						"WHERE sz.SZ_ID=t.SZ_ID and p.P_ID=t.P_ID and pr.T_ID=t.T_ID and t.T_ID in (SELECT T_ID FROM promociok)")
	
	cursor.execute(select_termekek)
	cnx.commit()
	termekek = cursor.fetchall()
	logging.warning(termekek)
	cursor.close()
	cnx.close()
	return jsonify({'termekek':termekek})	
		
	
@app.route('/egytermek/', methods = ['POST'])	
def egytermek():
	id = json.loads(request.data)
	logging.warning(id)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	select_termek = ("SELECT t.Nev, t.Leiras, t.Ar, t.Kep, t.Min_rendelesi_menny, t.Keszlet_menny, sz.Nev, p.Penznem, k.Nev, m.Nev FROM Termekek t, Szemelyek sz, Penznemek p, Kategoriak k, Mertekegysegek m WHERE sz.SZ_ID=t.SZ_ID and p.P_ID=t.P_ID and k.K_ID=t.K_ID and m.ME_ID=t.ME_ID and T_ID = %s")
	cursor.execute(select_termek, [id])
	cnx.commit()
	termek = cursor.fetchall()
	logging.warning(termek)
	cursor.close()
	cnx.close()
	return jsonify({'termek':termek})
	
	
@app.route('/egypromtermek/', methods = ['POST'])	
def egypromtermek():
	id = json.loads(request.data)
	logging.warning(id)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	select_termek = ("SELECT t.Nev, t.Leiras, t.Ar, t.Kep, t.Min_rendelesi_menny, t.Keszlet_menny, sz.Nev, p.Penznem, k.Nev, m.Nev, pr.Ar, pr.Periodus_k, pr.Periodus_v "
					 "FROM Termekek t, Szemelyek sz, Penznemek p, Kategoriak k, Mertekegysegek m,Promociok pr "
					 "WHERE sz.SZ_ID=t.SZ_ID and p.P_ID=t.P_ID and k.K_ID=t.K_ID and m.ME_ID=t.ME_ID and pr.T_ID=t.T_ID and t.T_ID = %s")
	cursor.execute(select_termek, [id])
	cnx.commit()
	
	termek = [] 
	i=0
	row = cursor.fetchone()
	while row is not None:
		row = list(row)
		termek.append(row)
		termek[i][11] = json.dumps(termek[i][11], default=date_handler)
		termek[i][12] = json.dumps(termek[i][12], default=date_handler)
		i = i+1
		row = cursor.fetchone()
		
	logging.warning(termek)
	cursor.close()
	cnx.close()
	return jsonify({'termek':termek})	
	
@app.route('/vizsgaltermek/', methods = ['POST'])	
def vizsgaltermek():		# a mennyisegek lekerdezese a kosarba-teves elott
	id = json.loads(request.data)
	logging.warning(id)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	select_termek = ("SELECT Min_rendelesi_menny, Keszlet_menny	"
					 "FROM Termekek "
					 "WHERE T_ID = %s")
	cursor.execute(select_termek, [id])
	cnx.commit()
	termek = cursor.fetchall()
	logging.warning(termek)
	cursor.close()
	cnx.close()
	return jsonify({'termek':termek})
	
	
@app.route('/kosarbatermek/', methods = ['POST'])	
def kosarbatermek():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	
	# csokkentjuk a keszleten levo termekmennyiseget
	update_termek = ("UPDATE Termekek SET Keszlet_menny = Keszlet_menny - %s WHERE T_ID = %s")
	
	try:
		cursor.execute( update_termek, (adatok['nr'], adatok['id']) )
		cnx.commit()
	except:
		cnx.rollback()
		cursor.close()
		cnx.close()
		return jsonify({'success': False})

	# vizsgaljuk, hogy mar van-e ennek a szemelynek a kosaraban ilyen IDju termek
	# ha igen, UPDATE-tel noveljuk a mennyiseget, ha nem, uj sort szurunk be
	select_termek = ("SELECT K_ID FROM Kosarak WHERE T_ID = %s AND SZ_ID = %s")	
	try:
		cursor.execute( select_termek, (adatok['id'], session['SZ_ID']) )
		cnx.commit()
	except:
		cnx.rollback()
		cursor.close()
		cnx.close()
		return jsonify({'success': False})
	
	if cursor.fetchone():			
		# mar letezik ez a termek ezzel a felhasznaloval a kosarak tablaban, ugyhogy update szukseges	
		query_termek = ("UPDATE Kosarak SET Mennyiseg = Mennyiseg + %s WHERE T_ID = %s AND SZ_ID = %s")
		data_termek = (adatok['nr'], adatok['id'], session['SZ_ID'])
		logging.warning(data_termek)	
	else:
		# beszurunk egy uj sort a kosarak tablaba	
		query_termek = ("INSERT INTO Kosarak "
						"(T_ID, SZ_ID, Mennyiseg)"
						"VALUES (%s, %s, %s)")
		data_termek = (adatok['id'], session['SZ_ID'], adatok['nr'] )
		logging.warning(data_termek)
	try:
		cursor.execute( query_termek, data_termek )
		cnx.commit()
	except:
		cnx.rollback()
		cursor.close()
		cnx.close()
		return jsonify({'success': False})	
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})			
	
	
	
@app.route('/lekerdezkosar/', methods = ['POST'])	
def lekerdezkosar():	
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	
	# vizsgaljuk, hogy mar van-e ennek a szemelynek a kosaraban termek
	
	# promocios termekek lekerdezese:
	select_termek = ("SELECT k.T_ID, t.Nev, sz.Nev, Mennyiseg, me.Nev, pr.Ar, Penznem "
					" FROM Kosarak k, Termekek t, Szemelyek sz, Mertekegysegek me, Penznemek p, Promociok pr "
					" WHERE t.T_ID = k.T_ID AND t.SZ_ID=sz.SZ_ID AND p.P_ID=t.P_ID AND k.SZ_ID = %s AND t.ME_ID=me.ME_ID AND pr.T_ID=k.T_ID "
					" AND k.T_ID IN ( SELECT T_ID FROM Promociok )")	
	try:
		cursor.execute( select_termek, [session['SZ_ID']] )
		cnx.commit()
	except:
		cnx.rollback()
		cursor.close()
		cnx.close()
		return jsonify({'hiba': True})	
	promok = cursor.fetchall()
	
	# NEM promocios termekek lekerdezese:
	select_termek = ("SELECT k.T_ID, t.Nev, sz.Nev, Mennyiseg, me.Nev, t.Ar, Penznem "
					" FROM Kosarak k, Termekek t, Szemelyek sz, Mertekegysegek me, Penznemek p"
					" WHERE t.T_ID = k.T_ID AND t.SZ_ID=sz.SZ_ID AND p.P_ID=t.P_ID AND t.ME_ID=me.ME_ID AND k.SZ_ID = %s "
					" AND k.T_ID NOT IN ( SELECT T_ID FROM Promociok )")	
	try:
		cursor.execute( select_termek, [session['SZ_ID']] )
		cnx.commit()
	except:
		cnx.rollback()
		cursor.close()
		cnx.close()
		return jsonify({'hiba': True})	
	termekek = cursor.fetchall()
	
	if not promok:	# ha vannak termekek, visszakuldjuk ezeket, ha nincs egy termek sem (sem normal, sem promocios), uzenetet kuldunk vissza
		if not termekek:
			return jsonify({'result': "Nincs_termek"})

	logging.warning(promok)
	logging.warning(termekek)
	cursor.close()
	cnx.close()
	
	return jsonify({'promok': promok, "termekek": termekek})	
	
	
	
@app.route('/torleskosarbol/', methods = ['POST'])	
def torleskosarbol():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	result = True
	
	update_termek = ("UPDATE Termekek SET Keszlet_menny = Keszlet_menny + %s WHERE T_ID = %s")
	try:
		cursor.execute( update_termek, (adatok['nr'], adatok['id']) )
		cnx.commit()
		result = True
	except:
		cnx.rollback()
		result = False
	
	delete_termek = ("DELETE FROM Kosarak WHERE T_ID = %s and SZ_ID = %s")
	try:
		cursor.execute( delete_termek, (adatok['id'], session['SZ_ID']) )
		cnx.commit()
		result = True
	except:
		cnx.rollback()
		result = False
	cursor.close()
	cnx.close()
	
	return jsonify({'success': result})		
		
	
	
@app.route('/rendeles/', methods = ['POST'])
def rendeles():
	adatok = json.loads(request.data)
	logging.warning(adatok['datum'])
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database)
	cursor = cnx.cursor()
	
	# lekerdezzuk a termekeket a kosarbol
	
# 1. promocios termekek lekerdezese ( az ar miatt kell szetvalasztani oket):
	select_termek = ("SELECT k.T_ID AS Id, Mennyiseg, Ar "
					" FROM Kosarak k, Promociok pr "
					" WHERE k.T_ID = pr.T_ID AND k.T_ID IN ( SELECT T_ID FROM Promociok ) AND k.SZ_ID = %s")	
	try:
		cursor.execute( select_termek, [session['SZ_ID']] )
	except:
		cnx.rollback()
		cursor.close()
		cnx.close()
		return jsonify({'success': False})	
	
	termekek = cursor.fetchall()
	cnx.commit()
	
	for termek in termekek:
		# berakjuk a termekeket a Megrendelesek tablaba
		add_rend = ("INSERT INTO Megrendelesek "
					"(Mennyiseg, Statusz, Datum, Ar, T_ID, Rendelo_ID)"
				    "VALUES (%s, 'Új rendelés', %s, %s, %s, %s)")
		data_rend = (termek[1], adatok['datum'], termek[2], termek[0], session['SZ_ID'])
		try:
			cursor.execute( add_rend, data_rend )
			cnx.commit()
		except:
			cnx.rollback()
			cursor.close()
			cnx.close()
			return jsonify({'success': False})	

# 2. nem promocios termekek lekerdezese ( az ar miatt kell szetvalasztani oket):
	select_termek = ("SELECT k.T_ID AS Id, Mennyiseg, Ar "
					" FROM Kosarak k, Termekek t "
					" WHERE k.T_ID = t.T_ID AND k.T_ID NOT IN ( SELECT T_ID FROM Promociok ) AND k.SZ_ID = %s")	
	try:
		cursor.execute( select_termek, [session['SZ_ID']] )
	except:
		cnx.rollback()
		cursor.close()
		cnx.close()
		return jsonify({'success': False})	
	
	termekek = cursor.fetchall()
	cnx.commit()
	
	for termek in termekek:
		# berakjuk a termekeket a Megrendelesek tablaba
		add_rend = ("INSERT INTO Megrendelesek "
					"(Mennyiseg, Statusz, Datum, Ar, T_ID, Rendelo_ID)"
				    "VALUES (%s, 'Új rendelés', %s, %s, %s, %s)")
		data_rend = (termek[1], adatok['datum'], termek[2], termek[0], session['SZ_ID'])
		try:
			cursor.execute( add_rend, data_rend )
			cnx.commit()
		except:
			cnx.rollback()
			cursor.close()
			cnx.close()
			return jsonify({'success': False})	

			
	# toroljuk a kosarbol az illeto szemely osszes termeket
	delete_kosar = ("DELETE FROM Kosarak WHERE SZ_ID = %s ")
	try:
		cursor.execute( delete_kosar, [session['SZ_ID']] )
		cnx.commit()
	except:
		cnx.rollback()
		cursor.close()
		cnx.close()
		return jsonify({'success': False})	
	
	cursor.close()
	cnx.close()
	return jsonify({'success': True})	
	
	
@app.route('/termekmodositas/', methods = ['POST'])
def termekmodositas():
	adatok = json.loads(request.data)
	
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database)
	cursor = cnx.cursor()
	string = ("UPDATE Termekek SET "
				"Nev = %s, Leiras = %s, Ar = %s, Min_rendelesi_menny = %s, Keszlet_menny = %s, SZ_ID = %s "
				"WHERE T_ID = %s")
	datas = (adatok['nev'], adatok['leiras'], adatok['ar'], adatok['rend_menny'], adatok['keszlet_menny'], session['SZ_ID'], adatok['id'])
	termek_kep='termek'+str(adatok['id'])+'.jpg'
	
	if os.path.exists('static/img/termekek/termek.jpg'):
		os.remove('static/img/termekek/' + termek_kep)
		logging.warning(termek_kep)
		os.rename('static/img/termekek/termek.jpg','static/img/termekek/' + termek_kep)
	try:
		cursor.execute(string, datas)
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
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	string = ("DELETE FROM Termekek WHERE T_ID = %s")
	cursor.execute(string, [adatok])
	cnx.commit()
	cursor.close()
	cnx.close()
	return jsonify({'success': True})



@app.route('/profilombetoltes/', methods = ['POST'])	
def profilombetoltes():
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
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
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	
	# vegzunk egy update-et a szemelyek tablaban, ha esetlegesen modosultak olyan adatok, amelyek ott szerepeltek
	update_regisztracional_megadott_adatok = ("UPDATE Szemelyek SET Nev = %s, Cim = %s, Tel = %s, Email = %s WHERE SZ_ID = %s")
	datas = (adatok['nev'], adatok['cim'], adatok['tel'], adatok['email'], session['SZ_ID'])
	logging.warning(datas)
	try:
		cursor.execute(update_regisztracional_megadott_adatok, datas)
		cnx.commit()
	except:
		cnx.rollback()
	
	str_teszt = ("SELECT * FROM Termelok WHERE SZ_ID = %s")
	cursor.execute(str_teszt, [session['SZ_ID']])
	cnx.commit()
	teszt_eredmeny = cursor.fetchone()
	logo='logo'+str(session['SZ_ID'])+'.jpg'
	
	if teszt_eredmeny is None :
		insert_profilom = ("INSERT INTO Termelok (SZ_ID, Kep, Kiszallitasi_dij, Min_vasarloi_kosar, R_ID, P_ID) VALUES (%s, %s, %s, %s, %s, %s) ")
		datas = (session['SZ_ID'], logo, adatok['kiszall_dij'], adatok['min_kosar'], adatok['rendszeresseg'], adatok['penznem'])
		try:
			cursor.execute(insert_profilom, datas)
			cnx.commit()
		except:
			cnx.rollback()
		os.rename('static/img/logos/logo.jpg','static/img/logos/'+logo)
		cnx.commit()
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
		update_profilom = ("UPDATE Termelok SET Kiszallitasi_dij = %s, Min_vasarloi_kosar = %s, R_ID = %s, P_ID = %s WHERE SZ_ID = %s")
		datas = (adatok['kiszall_dij'], adatok['min_kosar'], adatok['rendszeresseg'], adatok['penznem'], session['SZ_ID'])
		logging.warning(datas)
		logging.warning(adatok['selected'])
		try:
			cursor.execute(update_profilom, datas)
			cnx.commit()
		except:
			cnx.rollback()
		if os.path.exists('static/img/logos/logo.jpg'):
			os.remove('static/img/logos/' + logo)
			logging.warning(logo)
			os.rename('static/img/logos/logo.jpg','static/img/logos/' + logo)	
		
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

@app.route('/jelszolekeres/', methods = ['POST'])
def jelszolekeres():
	#adatok = json.loads(request.data)
	#logging.warning(adatok)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	
	jelszo = ("SELECT Jelszo FROM Szemelyek WHERE SZ_ID = %s")
	data = ([session['SZ_ID']])
	cursor.execute(jelszo, data)
	cnx.commit()
	password = ""
	password = cursor.fetchone()
	logging.warning(password)
	
	cursor.close()
	cnx.close()
	
	return jsonify({'pass':password})
	
@app.route('/jelszomodositas/', methods = ['POST'])
def jelszomodositas():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	
	update_jelszo = ("UPDATE Szemelyek SET Jelszo = %s WHERE SZ_ID = %s")
	datas = (adatok['ujpass1'], session['SZ_ID'])
	logging.warning(datas)
	try:
		cursor.execute(update_jelszo, datas)
		cnx.commit()
	except:
		cnx.rollback()
	
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})	
	
@app.route('/logo_upload', methods=['POST'])
def logo_upload():
    # Get the name of the uploaded file
    l_file = request.files['l_file']
    # Check if the file is one of the allowed types/extensions
    if l_file and allowed_file(l_file.filename):
        # Make the filename safe, remove unsupported chars
        # filename = secure_filename(file.filename)
        l_filename = 'logo.jpg'
        # Move the file form the temporal folder to
        # the upload folder we setup
        l_file.save(os.path.join(app.config['UPLOAD_FOLDER'], l_filename))
        # Redirect the user to the uploaded_file route, which
        # will basicaly show on the browser the uploaded file
    return redirect('/termelo')
		
# This route is expecting a parameter containing the name
# of a file. Then it will locate that file on the upload
# directory and show it on the browser, so if the user uploads
# an image, that image is going to be show after the upload
# @app.route('/static/img/logos/<filename>')
def uploaded_logo_file(l_filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               l_filename)
							   
@app.route('/promtermekekbetoltes/', methods = ['POST'])	
def promtermekekbetoltes():
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	select_termekek = ("SELECT T_ID, Nev FROM Termekek WHERE SZ_ID = %s")
	select_promtermekek_regiadatai = ("SELECT T_ID, Nev, Ar, Penznemek.P_ID, Penznem FROM Termekek, Penznemek WHERE T_ID in (SELECT Promociok.T_ID FROM Termekek, Promociok WHERE Termekek.T_ID = Promociok.T_ID AND Termekek.SZ_ID = %s) AND Penznemek.P_ID = Termekek.P_ID")
	select_promtermekek = ("SELECT * FROM Promociok WHERE T_ID in (SELECT Promociok.T_ID FROM Termekek, Promociok WHERE Termekek.T_ID = Promociok.T_ID AND Termekek.SZ_ID = %s)")
	select_promtermekekuj = ("SELECT T_ID,Ar FROM Promociok WHERE T_ID in (SELECT Promociok.T_ID FROM Termekek, Promociok WHERE Termekek.T_ID = Promociok.T_ID AND Termekek.SZ_ID = %s)")
	select_penznemek = ("SELECT P_ID, Penznem FROM Penznemek")
	
	cursor.execute(select_termekek, [session['SZ_ID']])
	cnx.commit()
	termekek_ertekek = cursor.fetchall()
	termekek = []
	for t in termekek_ertekek:
		termekek.append({'value':t[0], 'text':t[1]})
	logging.warning(termekek)
	
	cursor.execute(select_promtermekek, [session['SZ_ID']])
	cnx.commit()
	promtermekek = cursor.fetchone()
	
	cursor.execute(select_promtermekekuj, [session['SZ_ID']])
	cnx.commit()
	promtermekekuj = cursor.fetchall()
	
	logging.warning(promtermekek)
	datumok = []
	if promtermekek is not None:
		cursor.execute(select_promtermekek, [session['SZ_ID']])
		cnx.commit()
		promtermekek = cursor.fetchall()
		
		logging.warning("promtermekek:")
		logging.warning(promtermekek)
		for termek in promtermekek:
			datumok.append(termek[2].isoformat())
			datumok.append(termek[3].isoformat())	
			
	logging.warning(datumok)
	
	cursor.execute(select_promtermekek_regiadatai, [session['SZ_ID']])
	cnx.commit()
	promtermekek_regiadatai = cursor.fetchall()
	logging.warning(promtermekek_regiadatai)
	
	cursor.close()
	cnx.close()
	return jsonify({'termekek':termekek, 'promtermekek':promtermekekuj, 'datumok':datumok, 'promtermekek_regiadatai':promtermekek_regiadatai})	

	
@app.route('/promtermekekmodositas/', methods = ['POST'])
def promtermekekmodositas():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	
	# itt elobb kitorlom a promocios termekeket, mert mindig csak max 3 lehet egy szemelynek
	torles = ("DELETE FROM Promociok WHERE T_ID in ( SELECT * FROM (SELECT Promociok.T_ID FROM Termekek,Promociok WHERE Termekek.T_ID = Promociok.T_ID AND Termekek.SZ_ID = %s)tmpTabla )")
	cursor.execute(torles, [session['SZ_ID']])
	cnx.commit()
	
	for i in [0,1,2]:
		# a termek id-jat a nevi adat alatt talalom
		insert_promtermek = ("INSERT INTO Promociok (T_ID, Ar, Periodus_k, Periodus_v) VALUES (%s, %s, %s, %s) ")
		datas = (adatok["nev"+str(i)], adatok["ar"+str(i)], adatok["kezdeti_d"+str(i)], adatok["vegso_d"+str(i)])
		logging.warning(datas)
		try:
			cursor.execute(insert_promtermek, datas)
			cnx.commit()
		except:
			cnx.rollback()
		
	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})
	
@app.route('/promtermek_aktualizal/', methods = ['POST'])	
def promtermek_aktualizal():
	adatok = json.loads(request.data) 
	logging.warning(adatok['nev'])
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	
	select_promtermekek_regiadatai = ("SELECT T_ID, Nev, Ar, Penznemek.P_ID, Penznem FROM Termekek, Penznemek WHERE Penznemek.P_ID = Termekek.P_ID AND Nev = %s ")
	cursor.execute(select_promtermekek_regiadatai, [adatok['nev']])
	
	cnx.commit()
	promtermekek_regiadatai = cursor.fetchone()
	logging.warning(promtermekek_regiadatai)
	
	cursor.close()
	cnx.close()
	return jsonify({'promtermekek_lista':promtermekek_regiadatai})
	
@app.route('/login/', methods = ['POST'])	
def login():
	adat = json.loads(request.data)
	logging.warning(adat)
	
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
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
		cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
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
		cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
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
	
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
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

@app.route('/m_profilombetoltes/', methods = ['POST'])	
def m_profilombetoltes():
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()

	select_profilom = ("SELECT SZ_ID, Nev, Cim, Tel, Email FROM Szemelyek WHERE SZ_ID = %s")
	
	cursor.execute(select_profilom, [session['SZ_ID']])
	cnx.commit()
	profilom = cursor.fetchone()
	logging.warning(profilom)
	
	cursor.close()
	cnx.close()
	return jsonify({'profilom':profilom})
	
@app.route('/m_profilommodositas/', methods = ['POST'])
def m_profilommodositas():
	adatok = json.loads(request.data)
	logging.warning(adatok)
	cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database, buffered=True)
	cursor = cnx.cursor()
	
	update_regisztracional_megadott_adatok = ("UPDATE Szemelyek SET Nev = %s, Cim = %s, Tel = %s, Email = %s WHERE SZ_ID = %s")
	datas = (adatok['nev'], adatok['cim'], adatok['tel'], adatok['email'], session['SZ_ID'])
	logging.warning(datas)
	try:
		cursor.execute(update_regisztracional_megadott_adatok, datas)
		cnx.commit()
	except:
		cnx.rollback()

	cursor.close()
	cnx.close()
	
	return jsonify({'success': True})	
	
app.debug = True;


if __name__ == '__main__':
    app.run()
	
