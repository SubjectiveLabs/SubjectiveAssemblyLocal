#[derive(Debug, Clone)]
pub struct Patch {
    pub id: u8,
    pub data: Data,
}

#[derive(Debug, Clone)]
pub enum Data {
    Name(String),
    Time(Time),
}

#[derive(Debug, Clone)]
pub enum Time {
    Hour(u8),
    Minute(u8),
}
