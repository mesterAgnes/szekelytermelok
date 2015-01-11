
class DAL:
	
	def __init__(self):
		connected = False
		cnx = null

	def getConnected(self):
		return connected
		
	def setConnected(self, value):
		connected = value
		
	def createConnection(self):
		try:
			cnx = mysql.connector.connect(user=conf.user, password=conf.password, host=conf.host, database=conf.database)
			connected = True
			return True
		except:
			return False
		
	def closeConnection(self):
		cnx.close()
		
	def executeQuery(self, query, errorMessage):
		try:
			self.cursor = cnx.cursor()
			createConnection()
		except:
			return False
		closeConnection();
		return value
		
		
